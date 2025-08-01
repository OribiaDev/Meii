const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags, Events } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription(`Bot Admin Controls`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Server Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Ban', value: 'serverban' },
                            { name: 'Unban', value: 'serverunban' },
                            { name: 'Confession Ban', value: 'serverconfessionban' },
                            { name: 'Confession Unban', value: 'serverconfessionunban' },
                            { name: 'Leave', value: 'serverleave' },
                        ))
                .addStringOption(option =>
                    option.setName('id_type')
                        .setDescription('Types of IDs')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Server ID', value: 'serverchoiceid' },
                            { name: 'Confession ID', value: 'confessionchoiceid' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('choiceid')
                        .setRequired(true)
                        .setDescription('The ID of your previous choice')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('User Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Bot Ban', value: 'botban' },
                            { name: 'Bot Unban', value: 'botunban' },
                            { name: 'Confession Ban', value: 'confessionban' },
                            { name: 'Confession Unban', value: 'confessionunban' },
                        ))
                .addStringOption(option =>
                    option.setName('id_type')
                        .setDescription('Types of IDs')
                        .setRequired(true)
                        .addChoices(
                            { name: 'User ID', value: 'userchoiceid' },
                            { name: 'Confession ID', value: 'confessionchoiceid' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('choiceid')
                        .setRequired(true)
                        .setDescription('The ID of your previous choice')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Admin Add', value: 'adminadd' },
                            { name: 'Admin Remove', value: 'adminremove' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setRequired(true)
                        .setDescription('The ID of the user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('confession')
                .setDescription('Quick Confession Moderation')
                .addStringOption(option =>
                    option
                        .setName('confessionid')
                        .setRequired(true)
                        .setDescription('The ID of the confession')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('quickreply')
                .setDescription('Quick replys to common messages')
                .addStringOption(option =>
                    option.setName('reply_preset')
                        .setDescription('type of preset message')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Confession Channel Problems', value: 'channelproblems' },
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Message Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Confession Remove', value: 'confessionremove' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('confessionid')
                        .setRequired(true)
                        .setDescription('The ID of the confession'))),
	async execute(interaction, db, databaseCollections, client) {
        //Database Collections
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        //Command
        const botDocument = await bot_data.find({ type: 'prod' }).toArray();
        const adminArray = botDocument[0].admins || [] 
        let index = adminArray.indexOf(`${interaction.member.user.id}`);
        if (index == -1) return await interaction.reply({content:"I'm sorry, this command can only be ran by the developers and admins of Meii.", flags: MessageFlags.Ephemeral  })
        const moderationType = interaction.options.getString('moderation_type');
        if(botDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find the bot data document.`, flags: MessageFlags.Ephemeral  })
        if (interaction.options.getSubcommand() === 'server') {
            //Server
            //Check if User or Confession ID
            const moderationType = interaction.options.getString('moderation_type');
            const id_type = interaction.options.getString('id_type');
            const choiceId = interaction.options.getString('choiceid').toUpperCase();
            let givenServerID = undefined;
            let serverObject = undefined;
            //Confession ID
            if(id_type=='confessionchoiceid'){
                //ID Lookup
                const confessionDocument = await confession_data.find({ confession_id: choiceId }).toArray();
                if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${choiceId}**.`, flags: MessageFlags.Ephemeral  })
                //ID Set
                serverObject = await client.guilds.fetch(confessionDocument[0].guild.id);
                givenServerID = confessionDocument[0].guild.id;
            }
            //Server ID
            if(id_type=='serverchoiceid'){
                givenServerID = interaction.options.getString('choiceid'); 
                serverObject = await client.guilds.fetch(givenServerID);
            }
            //Ban
            if(moderationType=='serverban'){
                let botBansArray = botDocument[0].server_bans || []
                let index = botBansArray.indexOf(`${givenServerID}`);
                if (index !== -1) return await interaction.reply({ content:`This server is already banned from using Meii.`, flags: MessageFlags.Ephemeral  })
                botBansArray.push(`${givenServerID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { server_bans: botBansArray } });
                if(serverObject==undefined) return await interaction.reply({content:`The server with the ID of \`${givenServerID}\` is now banned from using Meii.`, flags: MessageFlags.Ephemeral  })        
                await serverObject.leave();
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now banned from using Meii.`, flags: MessageFlags.Ephemeral  })
            }
            //Unban
            if(moderationType=='serverunban'){
                let botBansArray = botDocument[0].server_bans || []
                let index = botBansArray.indexOf(`${givenServerID}`);
                if (index == -1) return await interaction.reply({ content:`This server isn't banned from using Meii.`, flags: MessageFlags.Ephemeral  })
                botBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { server_bans: botBansArray } });
                if(serverObject==undefined) return interaction.reply({content:`The server with the the ID of \`${givenServerID}\` is now unbanned from using Meii.`, flags: MessageFlags.Ephemeral  })
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now unbanned from using Meii.`, flags: MessageFlags.Ephemeral  })
            }
            //Confession Ban
            if(moderationType=='serverconfessionban'){
                let confessionBotBansArray = botDocument[0].server_confession_bans || []
                let index = confessionBotBansArray.indexOf(`${givenServerID}`);
                if (index !== -1) return await interaction.reply({ content:`This server is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBotBansArray.push(`${givenServerID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { server_confession_bans: confessionBotBansArray } });
                if(serverObject==undefined) return await interaction.reply({content:`The server with the ID of \`${givenServerID}\` is now banned from using confessions.`, flags: MessageFlags.Ephemeral  })        
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now banned from using confessions.`, flags: MessageFlags.Ephemeral  })
            }
            //Confession Unban
            if(moderationType=='serverconfessionunban'){
                let confessionBotBansArray = botDocument[0].server_confession_bans || []
                let index = confessionBotBansArray.indexOf(`${givenServerID}`);
                if (index == -1) return await interaction.reply({ content:`This server isn't banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBotBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { server_confession_bans: confessionBotBansArray } });
                if(serverObject==undefined) return interaction.reply({content:`The server with the the ID of \`${givenServerID}\` is now unbanned from using confessions.`, flags: MessageFlags.Ephemeral  })
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now unbanned from using confessions.`, flags: MessageFlags.Ephemeral  })
            }
            //Leave
            if(moderationType=='serverleave'){
                if(serverObject==undefined) return interaction.reply({content:`I cannot find a server with that ID.`, flags: MessageFlags.Ephemeral  })
                await serverObject.leave();
                return interaction.reply({content:`Meii has now left \`${serverObject.name} (${serverObject.id})\`.` })
            }
        } else if (interaction.options.getSubcommand() === 'user'){ 
            //Check if User or Confession ID
            const moderationType = interaction.options.getString('moderation_type');
            const id_type = interaction.options.getString('id_type');
            const choiceId = interaction.options.getString('choiceid').toUpperCase();
            let givenUserID = undefined;
            //Confession ID
            if(id_type=='confessionchoiceid'){
                //ID Lookup
                const confessionDocument = await confession_data.find({ confession_id: choiceId }).toArray();
                if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${choiceId}**.`, flags: MessageFlags.Ephemeral  })
                //ID Set
                givenUserID = confessionDocument[0].author.id;
            }
            //User ID
            if(id_type=='userchoiceid'){
                givenUserID = choiceId;
            }
            //Bot Ban
            if(moderationType=='botban'){
                let userBansArray = botDocument[0].user_bans || []
                let index = userBansArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already banned from using Meii.`, flags: MessageFlags.Ephemeral  })
                userBansArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { user_bans: userBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using Meii.` })
            }
            //Bot Unban
            if(moderationType=='botunban'){
                let userBansArray = botDocument[0].user_bans || []
                let index = userBansArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't banned from using Meii.`, flags: MessageFlags.Ephemeral  })
                userBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { user_bans: userBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using Meii.` })
            }
            //Confession Ban
            if(moderationType=='confessionban'){
                let confessionBansArray = botDocument[0].user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBansArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using confessions.` })
            }
            //Confession Unban
            if(moderationType=='confessionunban'){
                let confessionBansArray = botDocument[0].user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using confessions.` })
            }
        } else if (interaction.options.getSubcommand() === 'bot'){ 
            //Bot
            const givenUserID = interaction.options.getString('userid');
            //Admin Add
            if(moderationType=='adminadd'){
                let adminArray = botDocument[0].admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already an admin of Meii.`, flags: MessageFlags.Ephemeral  })
                adminArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now an admin of Meii.` })
            }
            //Admin Remove
            if(moderationType=='adminremove'){
                let adminArray = botDocument[0].admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't an admin of Meii.`, flags: MessageFlags.Ephemeral  })
                adminArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now removed as an admin of Meii.` })
            }
        } else if (interaction.options.getSubcommand() === 'message'){ 
            //ID Lookup
            const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
            const confessionDocument = await confession_data.find({ confession_id: givenConfessionID }).toArray();
            if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, flags: MessageFlags.Ephemeral  })
            //Message Remove
            if(moderationType=='confessionremove'){
                try{
                    return client.shard.broadcastEval(async (c, { channelId, messageID }) => {
                        const channel = c.channels.cache.get(channelId);
                        if (channel) {
                            //Get Message
                            const confessionMessage = await channel.messages.fetch(messageID);
                            if(confessionMessage){
                                //Editing Message
                                const TOSMessage = "\n__**This confession has been removed for breaking Discord's and/or Meii's TOS.**__\n";
                                await confessionMessage.edit({content: `${TOSMessage}`, embeds: []});
                                return true;
                            }
                            return false;
                        }
                        return false;
                    }, { context: { channelId: confessionDocument[0].message.channel_id, messageID: confessionDocument[0].message.id } })
                        .then(sentArray => {
                            // Search for a non falsy value before providing feedback
                            if (!sentArray.includes(true)) {
                                return interaction.reply({content:`I'm sorry, I couldnt edit/delete that confession.`, flags: MessageFlags.Ephemeral  })
                            }
                            return interaction.reply({content:`The confession with the ID of **${givenConfessionID}** has been successfully edited/removed.` })
                        });
                } catch (error) {
                    //Critical Error Catch
                    interaction.reply({content:`I'm sorry, there has been a error editing this confession.`, flags: MessageFlags.Ephemeral  })
                    return;
                }
            }
        } else if (interaction.options.getSubcommand() == 'confession'){
            //ID Lookup
            const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
            const confessionDocument = await confession_data.find({ confession_id: givenConfessionID }).toArray();
            if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, flags: MessageFlags.Ephemeral  })
           //Buttons
           //Confession Delete Button
            const confessionDeleteButton = new ButtonBuilder()
            .setCustomId('confession-delete')
            .setLabel('Delete/Edit Confession')
            .setStyle(ButtonStyle.Primary);
    
            //Confession Ban Button
            const confessionBanButton = new ButtonBuilder()
            .setCustomId('confessions-ban')
            .setLabel('Confession Ban')
            .setStyle(ButtonStyle.Secondary);
            
            //Dismiss Button
            const confessionDismiss = new ButtonBuilder()
            .setCustomId('confessions-dismiss')
            .setLabel('Dismiss')
            .setStyle(ButtonStyle.Danger);
    
            //create button action row
            const buttonRow = new ActionRowBuilder().addComponents(confessionDeleteButton, confessionBanButton, confessionDismiss)
            const interactionListener = async (interaction) => {
                if (!interaction.isMessageComponent()) return;
                if(interaction.isButton()){
                    //Confession Delete Button
                    if (interaction.customId === 'confession-delete') { 
                        try{
                            return client.shard.broadcastEval(async (c, { channelId, messageID }) => {
                                const channel = c.channels.cache.get(channelId);
                                if (channel) {
                                    //Get Message
                                    const confessionMessage = await channel.messages.fetch(messageID);
                                    if(confessionMessage){
                                        //Editing Message
                                        const TOSMessage = "\n__**This confession has been removed for breaking Discord's and/or Meii's TOS.**__\n";
                                        await confessionMessage.edit({content: `${TOSMessage}`, embeds: []});
                                        return true;
                                    }
                                    return false;
                                }
                                return false;
                            }, { context: { channelId: confessionDocument[0].message.channel_id, messageID: confessionDocument[0].message.id } })
                                .then(sentArray => {
                                    // Search for a non falsy value before providing feedback
                                    if (!sentArray.includes(true)) {
                                        return interaction.reply({content:`I'm sorry, I couldnt edit/delete that confession.`, flags: MessageFlags.Ephemeral  })
                                    }
                                    return interaction.reply({content:`The confession with the ID of **${givenConfessionID}** has been successfully edited/removed.` })
                                });
                        } catch (error) {
                            //Critical Error Catch
                            interaction.reply({content:`I'm sorry, there has been a error editing this confession.`, flags: MessageFlags.Ephemeral  })
                            return;
                        }
    
                    }
                    //Confession Ban Button
                    if (interaction.customId === 'confessions-ban') {   
                        let confessionBansArray = botDocument[0].user_confession_bans || []
                        let confession_author_id = confessionDocument[0].author.id;
                        let index = confessionBansArray.indexOf(`${confession_author_id}`);
                        if (index !== -1) return await interaction.reply({ content:`This user is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                        confessionBansArray.push(`${confession_author_id}`)  
                        await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                        return interaction.reply({content:`The user with the ID of \`${confession_author_id}\` is now banned from using confessions.` })
                    }
                    //Dismiss Button
                    if (interaction.customId === 'confessions-dismiss') { 
                        client.removeListener(Events.InteractionCreate, interactionListener);
                        await interaction.update({ content:`Dismissed.`, components: [], embeds:[] })
                    }
                }
            };
    
            client.on(Events.InteractionCreate, interactionListener);
            //Embed
            let quickMenuEmbed = new EmbedBuilder()
            .setTitle(`Confession Quick Moderation Menu: ${givenConfessionID}`)
            .setColor(`#ff6961`)
            .setDescription(`**Please select an option.**`)
            .setTimestamp()
            await interaction.reply({ embeds: [quickMenuEmbed], components: [buttonRow], allowedMentions: {repliedUser: false}})
         } else if(interaction.options.getSubcommand() == 'quickreply'){
            //Quick Replys
            const replyPreset = interaction.options.getString('reply_preset');
            if(replyPreset === "channelproblems"){
                let channelProblemEmbed = new EmbedBuilder()
                .setTitle(`Channel not showing up in the settings command:`)
                .setColor(`#ff6961`)
                .setDescription(`Please follow these solutions, if they don't work please feel free to reply and let me know! \n\n **__Fix 1:__**\nTry moving the channel(s) you're wanting to use to the very top of your channel list.\n\n  **__Fix 2:__** \n Due to discords limit on dropdown menus there can only be a maximum of 25 channels listed. To fix this please change the permissions on all your channels so that Meii **only** has access to the channel(s) you're wanting to use. \n\n **__Fix 3:__** \n Meii only shows channels that have the necessary permissions. Please make sure Meii has the permissions \`Send Messages\`, \`View Channel\`, and \`Embed Links\` on the channel(s) you're wanting to use. \n\n`)
                .setTimestamp()
                await interaction.reply({ embeds: [channelProblemEmbed]})
            }
         }
	},
}; 