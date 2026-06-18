const { EmbedBuilder, SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js')
const randomHexColor = require('random-hex-color') 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('review')
		.setDescription('Approves/Denies a confession sent for review')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession'))
        .addStringOption(option =>
			option.setName('approve_deny')
				.setDescription('Approve or deny the confession')
				.setRequired(true)
				.addChoices(
					{ name: 'Approve', value: 'approve' },
					{ name: 'Deny', value: 'deny' }
				)),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
		await interaction.deferReply();
        //Database Collections
        let server_data = databaseCollections.server_data;
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        let temp_confession_data = databaseCollections.temp_confession_data;
        //Get Vars
        const id = interaction.options.getString('confession_id').toUpperCase();;
        const choice = interaction.options.getString('approve_deny');
        //Check ID
        const tempconfessionDocument = await temp_confession_data.findOne({ confession_id: id });
        if(tempconfessionDocument==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession review with the ID of **${id}**\nPlease make sure the confession ID is correct.` })
        //Database Calls
        const [botDocument, guildDocument] = await Promise.all([
                bot_data.findOne({ type: 'prod' }),
                server_data.findOne({ server_id: tempconfessionDocument.guild.id })
        ]);
        //Check if enabled
        if(guildDocument.settings.confession_review_channel_id==undefined) return interaction.editReply({content:`I'm sorry, confession review is not enabled on this server.` })
        //Check if in same guild
        if(interaction.guild.id!=tempconfessionDocument.guild.id) return interaction.editReply({content:`Please use this command in the same server as the confession review.` })
        //Approve
        if(choice=='approve'){

            //Get Vars
            let confessionID = tempconfessionDocument.confession_id;
            let confessedmessage = tempconfessionDocument.confession_text;
            let channelID = tempconfessionDocument.message.channel_id;
            let confessionchannel = interaction.guild.channels.cache.get(channelID);
            let attachment = tempconfessionDocument?.confession_attachment;

            //Check if reply
            if(tempconfessionDocument.message?.isReply){
                //Declare Varts
                let givenconfessionID = tempconfessionDocument.message.isReply
                const confessionDocument = await confession_data.findOne({ confession_id: givenconfessionID });
                let confessionchannel = client.channels.cache.get(confessionDocument.message.channel_id);
                const confessionMessage = await confessionchannel.messages.fetch(confessionDocument.message.id);
                let guildObject = client.guilds.cache.get(confessionDocument.guild.id);
                let channels = guildDocument.settings.confession_channel_ids;

                //Confession Reply Customization
                let defaultValues = { "title": `:love_letter: Anonymous Reply to {reply_id}`, "body": "> {confession}", "color": "{random}"}
                let dataExists = false; 
                if(guildDocument?.customization_reply) dataExists = true;
                let titleData = dataExists ? guildDocument.customization_reply.title : defaultValues.title;
                let TitleParsed = titleData.replace('{id}', confessionID)
                TitleParsed = TitleParsed.replace('{ID}', confessionID)
                TitleParsed = TitleParsed.replace('{reply_id}', givenconfessionID)
                TitleParsed = TitleParsed.replace('{REPLY_ID}', givenconfessionID)
                let bodyData = dataExists? guildDocument.customization_reply.body : defaultValues.body;
                let bodyParsed = bodyData.replace('{confession}', confessedmessage)
                bodyParsed = bodyParsed.replace('{CONFESSION}', confessedmessage)
                let colorData = dataExists ? guildDocument.customization_reply.color : defaultValues.color;
                let colorParsed = colorData.replace('{random}', randomHexColor())
                colorParsed = colorParsed.replace('{RANDOM}', randomHexColor())

                try{
                    //Replying to Confession
                    //Sending Confession
                    let Confession = new EmbedBuilder()
                    .setTitle(`${TitleParsed}`)
                    .setColor(`${colorParsed}`)
                    .setDescription(`${bodyParsed}`)
                    .setImage(attachment?.url)
                    .setFooter({text: `✨  If this reply breaks TOS or is overtly hateful, you can report it with "/report ${confessionID}"`})
                    const sentConfession = await confessionMessage.reply({ embeds: [Confession], allowedMentions: {repliedUser: false}}) 
                    //Get message ID
                    const confessionMessageId = sentConfession.id;
                    //Log confession data
                    if(attachment?.url){
                        await confession_data.insertOne({ "document_date": new Date(), "confession_id": `${confessionID}`, "confession_text": `${confessedmessage}`, "confession_attachment": `${attachment.url}`,"author": { "username": `${interaction.member.user.username}`, "id": `${interaction.member.user.id}` }, "guild": { "name": `${guildObject.name}`, "id": `${guildObject.id}` }, "message": { "id": `${confessionMessageId}`, "channel_id": `${confessionchannel.id}`, "isReply": `${givenconfessionID}` }});
                    }else {
                        await confession_data.insertOne({ "document_date": new Date(), "confession_id": `${confessionID}`, "confession_text": `${confessedmessage}`,"author": { "username": `${interaction.member.user.username}`, "id": `${interaction.member.user.id}` }, "guild": { "name": `${guildObject.name}`, "id": `${guildObject.id}` }, "message": { "id": `${confessionMessageId}`, "channel_id": `${confessionchannel.id}`, "isReply": `${givenconfessionID}` }});
                    }
                    let confessionNumber = botDocument.confession_number;
                    confessionNumber = confessionNumber + 1;
                    await bot_data.updateOne({ type: `prod` }, { $set: { confession_number: confessionNumber } });
                    await interaction.editReply({ content: `The confession with the ID of **${confessionID}** has now been approved and added to **${confessionchannel}**  :thumbsup:` });
                    //Check if server has Confession Logging 
                    if(guildDocument?.settings?.confession_log_channel_id==undefined) return
                    if(!client.channels.cache.get(guildDocument?.settings?.confession_log_channel_id)) return
                    //Getting the channel
                    let confessionmodchannel = client.channels.cache.get(guildDocument.settings.confession_log_channel_id)
                    //Permissions Check
                    if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) return
                    if(confessionmodchannel.isThread()){ if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads)){return}}
                    //Get message link
                    const messageLink = sentConfession.url;
                    //Sending the Confession Log
                    let LogD;
                    if(channels.length > 1){
                        //If Multiple Channels
                        LogD = `**Message**\n"${confessedmessage}"\n\n**Confession Channel**\n${confessionchannel}\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**User**\n||${interaction.member.user.username}  (${interaction.member})||`
                        if(attachment?.url){
                            LogD = `**Message**\n"${confessedmessage}"\n\n**Confession Channel**\n${confessionchannel}\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**User**\n||${interaction.member.user.username}  (${interaction.member})|| \n\n**Image**\n${attachment?.url}`
                        }
                    }else{
                        //If Single Channel
                        LogD = `**Message**\n"${confessedmessage}"\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**User**\n||${interaction.member.user.username}  (${interaction.member})||`
                        if(attachment?.url){
                            LogD = `**Message**\n"${confessedmessage}"\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**User**\n||${interaction.member.user.username}  (${interaction.member})|| \n\n**Image**\n${attachment?.url}`
                        }
                    }
                    let ConfessionLog = new EmbedBuilder()
                    .setTitle(`:love_letter: **Anonymous Reply Log to ${givenconfessionID}**`)
                    .setColor(randomHexColor())
                    .setDescription(LogD)
                    .setTimestamp()
                    .setFooter({text: "Meii"})
                    confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                    return;


                }catch( error ){
                    console.log(error)
                    return await interaction.editReply({content: `I'm sorry, there has been an error. Please try again.`, flags: MessageFlags.Ephemeral  })
                }
                return
            }
            
            //Confession Customization
            let defaultValues = { "title": `:love_letter: Anonymous Confession ({id})`, "body": "> {confession}", "color": "{random}"}
            let dataExists = false;
            if(guildDocument?.customization) dataExists = true;
            let titleData = dataExists ? guildDocument.customization.title : defaultValues.title;
            let TitleParsed = titleData.replace('{id}', confessionID)
            TitleParsed = TitleParsed.replace('{ID}', confessionID)
            let bodyData = dataExists? guildDocument.customization.body : defaultValues.body;
            let bodyParsed = bodyData.replace('{confession}', confessedmessage)
            bodyParsed = bodyParsed.replace('{CONFESSION}', confessedmessage)
            let colorData = dataExists ? guildDocument.customization.color : defaultValues.color;
            let colorParsed = colorData.replace('{random}', randomHexColor())
            colorParsed = colorParsed.replace('{RANDOM}', randomHexColor())
        
            try{
                //Confession Checks
                if(confessionchannel.isThread()){ if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.editReply({ content: `I'm sorry, I don't have enough permissions in <#${confessionchannel.id}>.\nI need... \`Send Messages\`, \`View Channel\`, \`Send Messages in Threads\`, and \`Embed Links\``, flags: MessageFlags.Ephemeral  }) }
                if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.editReply({ content: `I'm sorry, I don't have enough permissions in <#${confessionchannel.id}>.\nI need... \`Send Messages\`, \`View Channel\`, and \`Embed Links\``, flags: MessageFlags.Ephemeral  })
                let Confession = new EmbedBuilder()
                .setTitle(`${TitleParsed}`)
                .setColor(`${colorParsed}`)
                .setDescription(`${bodyParsed}`)
                .setImage(attachment)
                .setFooter({text: `✨  If this confession breaks TOS or is overtly hateful, you can report it with "/report ${confessionID}"`})
                const sentConfession = await confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}}) 
                //Get message ID
                const confessionMessageId = sentConfession.id;
                //Log confession data
                if(attachment){
                    await confession_data.insertOne({ "document_date": new Date(), "confession_id": `${confessionID}`, "confession_text": `${confessedmessage}`, "confession_attachment": `${tempconfessionDocument.confession_attachment}`,"author": { "username": `${tempconfessionDocument.author.username}`, "id": `${tempconfessionDocument.author.id}` }, "guild": { "name": `${interaction.guild.name}`, "id": `${interaction.guild.id}` }, "message": { "id": `${confessionMessageId}`, "channel_id": `${confessionchannel.id}`}});
                }else {
                    await confession_data.insertOne({ "document_date": new Date(), "confession_id": `${confessionID}`, "confession_text": `${confessedmessage}`,"author": { "username": `${tempconfessionDocument.author.username}`, "id": `${tempconfessionDocument.author.id}` }, "guild": { "name": `${interaction.guild.name}`, "id": `${interaction.guild.id}` }, "message": { "id": `${confessionMessageId}`, "channel_id": `${confessionchannel.id}`}});
                }
                //Delete temp document
                await temp_confession_data.deleteOne({ confession_id: confessionID});
                //Confession Number Increase
                await bot_data.updateOne({ type: `prod` }, { $inc: { confession_number: 1 } });

                await interaction.editReply({ content: `The confession with the ID of **${confessionID}** has now been approved and added to **${confessionchannel}**  :thumbsup:` });
                //Check if server has Confession Logging 
                if(guildDocument.settings.confession_log_channel_id==undefined) return
                if(!client.channels.cache.get(guildDocument.settings.confession_log_channel_id)) return
                //Getting the channel
                let confessionmodchannel = client.channels.cache.get(guildDocument.settings.confession_log_channel_id)
                //Permissions Check
                if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return
                if(confessionmodchannel.isThread()){ if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads)){return}}
                //Get member object
                let LogMember;
                try{
                    LogMember = await interaction.guild.members.fetch(tempconfessionDocument.author.id);
                } catch{
                    LogMember = tempconfessionDocument.author.id;
                }
                //Sending the Confession Log
                let LogD;
                //Get message link
                const messageLink = sentConfession.url;
                LogD = `**Message**\n"${confessedmessage}"\n\n**Confession Channel**\n${confessionchannel}\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**Author**\n||${tempconfessionDocument.author.username}  (${LogMember})||`
                if(attachment?.url){
                    LogD = `**Message**\n"${confessedmessage}"\n\n**Confession Channel**\n${confessionchannel}\n\n**Confession ID** (click to jump to confession)\n[${confessionID}](${messageLink})\n\n**Author**\n||${tempconfessionDocument.author.username}  (${LogMember})|| \n\n**Image**\n${attachment?.url}`
                }
                let ConfessionLog = new EmbedBuilder()
                .setTitle(`:love_letter: **Anonymous Confession Log**`)
                .setColor(randomHexColor())
                .setDescription(LogD)
                .setTimestamp()
                .setFooter({text: "Meii"})
                try{
                    await confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})
                }catch (e){
                    return
                }   
            }catch( error ){
                return await interaction.editReply({content: `I'm sorry, there has been an error. Please try again.`, flags: MessageFlags.Ephemeral  })
            }
        }else if(choice=='deny'){
        //Deny
            await temp_confession_data.deleteOne({ confession_id: id});
            return interaction.editReply({content:`The confession with the ID of **${id}** has now been denied and deleted.` })
        }
	},
};