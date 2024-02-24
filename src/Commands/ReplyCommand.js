const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reply')
		.setDescription('Replys to an anonymous confession')
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession you want to reply to, found in the footer or title'))
        .addStringOption(option =>
            option
                .setName('message')
                .setRequired(true)
                .setDescription('The message you want to confess')),
	async execute(interaction, db, databaseCollections, client, prefix) {
        await interaction.deferReply({ ephemeral: true });
        //Database Collections
        let server_data = databaseCollections.server_data;
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        //Get confession document
        const givenconfessionID = interaction.options.getString('confession_id').toUpperCase();
        const confessionDocument = await confession_data.find({ confession_id: givenconfessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${givenconfessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, ephemeral: true })
        //Get Guild from Document
        guildObject = client.guilds.cache.get(confessionDocument[0].guild.id);
        if(guildObject==undefined) return await interaction.editReply({content:`I'm sorry, I cannot find the guild thats associated with the confession ID of \`${givenconfessionID}\`.`, ephemeral: true })   
        //Admin Bans
        const botDocument = await bot_data.find({ type: 'prod' }).toArray();
        //Admin Confession Server Ban
        let AdminServerConfessionBanned = new EmbedBuilder()
        .setTitle(`**${guildObject.name}: Server Confession Banned**`)
        .setColor("#ff6961")
        .setDescription(`I'm sorry, The server **${guildObject.name}** is banned from using the confession feature on Meii.`)
        .setFooter({text:`If you think this is a mistake, please join the support server.`})
        const serverBansArray = botDocument[0].server_confession_bans || [] 
        let serverBanindex = serverBansArray.indexOf(`${guildObject.id}`);
        if (serverBanindex !== -1) return await interaction.editReply({ embeds: [AdminServerConfessionBanned], ephemeral: true, allowedMentions: {repliedUser: false}})
        //Admin Confession User Ban
        let AdminUserConfessionBanned = new EmbedBuilder()
        .setTitle(`**${interaction.member.user.username} : Confession Banned**`)
        .setColor("#ff6961")
        .setDescription(`I'm sorry, you are globally banned from using the confession feature on Meii.`)
        .setFooter({text:`If you think this is a mistake, please join the support server.`})
        const userBansArray = botDocument[0].user_confession_bans || [] 
        let userBanindex = userBansArray.indexOf(`${interaction.member.user.id}`);
        if (userBanindex !== -1) return await interaction.editReply({ embeds: [AdminUserConfessionBanned], ephemeral: true, allowedMentions: {repliedUser: false}})
        //Guild Document
        const guildDocument = await server_data.find({ server_id: guildObject.id }).toArray();
        //Database Document Check
        let ConfessionNotSet = new EmbedBuilder()
        .setTitle(`**Confession Channel Not Set**`)
        .setColor('#ff6961')
        .setDescription(`I'm sorry, the confession channel is not setup for **${guildObject.name}**.`)
        .setFooter({text:`Ask a staff member to set it up with ${prefix}set confession_channel`})
        //No Confess Channel
        if(guildDocument[0]==undefined) return await interaction.editReply({ embeds: [ConfessionNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})   
        //Check if user is banned from confessions
        let ConfessionIsBanned = new EmbedBuilder()
        .setTitle(`**${guildObject.name}: Confession Banned**`)
        .setColor("#ff6961")
        .setDescription(`I'm sorry, you're banned from using confessions in **${guildObject.name}**.`)
        .setFooter({text:`If you think this is a mistake, please contact a staff member.`})
        const userbans = guildDocument[0].confession_userbans_id || [] //returns empty array if userbans is not present
        let index = userbans.indexOf(`${interaction.member.user.id}`);
        if (index !== -1) return await interaction.editReply({ embeds: [ConfessionIsBanned], ephemeral: true, allowedMentions: {repliedUser: false}})
        //Confession Channel Error
        let channelNotFound = new EmbedBuilder()
        .setTitle(`**${guildObject.name}: Confession Channel Error**`)
        .setColor('#ff6961')
        .setDescription(`I'm sorry, i'm having trouble finding the confession channel in **${guildObject.name}**.`)
        .setFooter({text:`Tell a staff member to re-set the confession channel!`})
        if(!client.channels.cache.get(guildDocument[0].confession_channel_id)) return await interaction.editReply({ embeds: [channelNotFound], ephemeral: true})
        //Getting Confession Info
        let confessionchannel = client.channels.cache.get(guildDocument[0].confession_channel_id)
        let confessedmessage = interaction.options.getString('message');
        //Random ID Generator for moderation
        let confessionID = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            confessionID += characters.charAt(randomIndex);
        }
        //Confession Customization
        let defaultValues = { "title": `:love_letter: Anonymous Reply to {reply_id}  ({id})`, "body": "> {confession}", "color": "{random}"}
        let dataExists = false; 
        if(guildDocument[0]?.customization_reply) dataExists = true;
        let titleData = dataExists ? guildDocument[0].customization_reply.title : defaultValues.title;
        let TitleParsed = titleData.replace('{id}', confessionID)
        TitleParsed = TitleParsed.replace('{ID}', confessionID)
        TitleParsed = TitleParsed.replace('{reply_id}', givenconfessionID)
        TitleParsed = TitleParsed.replace('{REPLY_ID}', givenconfessionID)
        let bodyData = dataExists? guildDocument[0].customization_reply.body : defaultValues.body;
        let bodyParsed = bodyData.replace('{confession}', confessedmessage)
        bodyParsed = bodyParsed.replace('{CONFESSION}', confessedmessage)
        let colorData = dataExists ? guildDocument[0].customization_reply.color : defaultValues.color;
        let colorParsed = colorData.replace('{random}', randomHexColor())
        colorParsed = colorParsed.replace('{RANDOM}', randomHexColor())
        //Test if confession is bigger than 4096 Char
        let confessionTooLong = new EmbedBuilder()
        .setTitle(`**${guildObject.name}: Confession Too Long**`)
        .setColor('#ff6961')
        .setDescription(`I'm sorry, your confession is too long.\nThe limit is **4096** characters, currently its **${bodyParsed.length}** characters.`)
        .setFooter({text:`Please shorten and try again!`})
        if(4096 < bodyParsed.length) return await interaction.editReply({ embeds: [confessionTooLong], ephemeral: true})
        //Test if Hex Code is valid
        var hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
        if(!hexRegex.test(colorParsed)) colorParsed = randomHexColor();
        try{
            //Confession Checks
            if(confessionchannel.isThread()){ if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) return await interaction.editReply({ content: `I'm sorry, I don't have enough permissions in <#${confessionchannel.id}>.\nI need... \`Send Messages\`, \`View Channel\`, \`Embed Links\`, and \`Send Messages in Threads\` `, ephemeral: true }) }
            if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) return await interaction.editReply({ content: `I'm sorry, I don't have enough permissions in <#${confessionchannel.id}>.\nI need... \`Send Messages\`, \`Embed Links\`, and \`View Channel\``, ephemeral: true })
            //Replying
            try{
                //Reply Message
                if (confessionchannel.isTextBased()) {
                    //Get Message
                    try{
                        const confessionMessage = await confessionchannel.messages.fetch(confessionDocument[0].message.id);  
                        try{
                            //Replying to Confession
                            //Sending Confession
                            let Confession = new EmbedBuilder()
                            .setTitle(`${TitleParsed}`)
                            .setColor(`${colorParsed}`)
                            .setDescription(`${bodyParsed}`)
                            .setFooter({text: `✨  If this confession breaks TOS or is overtly hateful, you can report it with "${prefix}report ${confessionID}"`})
                            const sentConfession = await confessionMessage.reply({ embeds: [Confession], allowedMentions: {repliedUser: false}}) 
                            //Get message ID
                            const confessionMessageId = sentConfession.id;
                            //Send confession data to confession moderation database
                            await confession_data.insertOne({ "document_date": new Date(), "confession_id": `${confessionID}`, "confession_text": `${confessedmessage}`,"author": { "username": `${interaction.member.user.username}`, "id": `${interaction.member.user.id}` }, "guild": { "name": `${guildObject.name}`, "id": `${guildObject.id}` }, "message": { "id": `${confessionMessageId}`, "channel_id": `${confessionchannel.id}`, "isReply": true }});
                            //Confession Number Increase
                            let confessionNumber = botDocument[0].confession_number;
                            confessionNumber = confessionNumber + 1;
                            await bot_data.updateOne({ type: `prod` }, { $set: { confession_number: confessionNumber } });
                            await interaction.editReply({ content: `Your reply has now been added to **${confessionchannel}**  :thumbsup:`, ephemeral: true });
                            //Check if server has Confession Logging 
                            if(guildDocument[0].confession_modlog_id==undefined) return
                            if(!client.channels.cache.get(guildDocument[0].confession_modlog_id)) return
                            //Getting the channel
                            let confessionmodchannel = client.channels.cache.get(guildDocument[0].confession_modlog_id)
                            //Permissions Check
                            if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) return
                            if(confessionmodchannel.isThread()){ if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads)){return}}
                            //Sending the Confession Log
                            let ConfessionLog = new EmbedBuilder()
                            .setTitle(`:love_letter: **Anonymous Reply to ${givenconfessionID}**`)
                            .setColor(randomHexColor())
                            .setDescription(`**Message**\n"${confessedmessage}"\n\n**Confession ID**\n${confessionID}\n\n**User**\n||${interaction.member.user.username}  (${interaction.member})||`)
                            .setTimestamp()
                            .setFooter({text: "Meii"})
                            confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                            return;
                        }catch{
                            interaction.editReply({content:`I'm sorry, there has been a error replying to this confession.`, ephemeral: true })
                            return;
                        }
                    }catch{
                        interaction.editReply({content:`I'm sorry, I cannot find this confession.`, ephemeral: true })
                    }
                } else {
                    //Error for non text channel
                    interaction.editReply({content:`I'm sorry, the stored confession channel is not a text channel.`, ephemeral: true })
                    return;
                }
            } catch (error) {
                //Critical Error Catch
                interaction.editReply({content:`I'm sorry, there has been a error replying to this confession.`, ephemeral: true })
                return;
            }
        }catch( error ){
            return await interaction.editReply({content: `I'm sorry, there has been an error. Please try again.`, ephemeral: true })
        }
	},
};