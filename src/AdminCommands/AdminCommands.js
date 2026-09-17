const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags, Events } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder() 
		.setName('admin')
		.setDescription(`Bot Admin Controls`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('User Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
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
                .setName('staff')
                .setDescription('Admin Staff Operations')
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
                .setDescription('Quick Confession Moderation Menu')
                .addStringOption(option =>
                    option
                        .setName('confessionid')
                        .setRequired(true)
                        .setDescription('The ID of the confession')))
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
                            { name: 'Confession Retrieve', value: 'confessionretrieve' },
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
        const botDocument = await bot_data.findOne({ type: 'prod' });
        const adminArray = botDocument.admins || [] 
        let index = adminArray.indexOf(`${interaction.member.user.id}`);
        if (index == -1) return await interaction.reply({content:"I'm sorry, this command can only be ran by the developers and admins of Meii.", flags: MessageFlags.Ephemeral  })
        const moderationType = interaction.options.getString('moderation_type');
        if(botDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find the bot data document.`, flags: MessageFlags.Ephemeral  })
        if (interaction.options.getSubcommand() === 'user'){ 
            //Check if User or Confession ID
            const moderationType = interaction.options.getString('moderation_type');
            const id_type = interaction.options.getString('id_type');
            const choiceId = interaction.options.getString('choiceid').toUpperCase();
            let givenUserID = undefined;
            //Confession ID
            if(id_type=='confessionchoiceid'){
                //ID Lookup
                const confessionDocument = await confession_data.findOne({ confession_id: choiceId });
                if(confessionDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${choiceId}**.`, flags: MessageFlags.Ephemeral  })
                //ID Set
                givenUserID = confessionDocument.author.id;
            }
            //User ID
            if(id_type=='userchoiceid'){
                givenUserID = choiceId;
            }
            //Confession Ban
            if(moderationType=='confessionban'){
                let confessionBansArray = botDocument.user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBansArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using confessions.` })
            }
            //Confession Unban
            if(moderationType=='confessionunban'){
                let confessionBansArray = botDocument.user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                confessionBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using confessions.` })
            }
        } else if (interaction.options.getSubcommand() === 'staff'){ 
            //staff
            const givenUserID = interaction.options.getString('userid');
            //Admin Add
            if(moderationType=='adminadd'){
                let adminArray = botDocument.admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already an admin of Meii.`, flags: MessageFlags.Ephemeral  })
                adminArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now an admin of Meii.` })
            }
            //Admin Remove
            if(moderationType=='adminremove'){
                let adminArray = botDocument.admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't an admin of Meii.`, flags: MessageFlags.Ephemeral  })
                adminArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now removed as an admin of Meii.` })
            }
        } else if (interaction.options.getSubcommand() === 'message'){ 
            //ID Lookup
            const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
            const confessionDocument = await confession_data.findOne({ confession_id: givenConfessionID });
            if(confessionDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, flags: MessageFlags.Ephemeral  })
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
                    }, { context: { channelId: confessionDocument.message.channel_id, messageID: confessionDocument.message.id } })
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
            if(moderationType=='confessionretrieve'){
                //Document Lookup
                const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
                const confessionDocument = await confession_data.findOne({ confession_id: givenConfessionID });
                if(confessionDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, flags: MessageFlags.Ephemeral  })
                //Get Values
                let confession_text = confessionDocument.confession_text;
                let confession_id = confessionDocument.confession_id;
                let confession_attachment = confessionDocument.confession_attachment;
                let confession_date_raw = new Date(confessionDocument.document_date)
                let confession_date = confession_date_raw.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York", timeZoneName: "short"});
                let confession_author = confessionDocument.author.username;
                let confession_author_id = confessionDocument.author.id;
                let guild_name = confessionDocument.guild.name;
                let guild_id = confessionDocument.guild.id;
                //Retrieve Embed
                let retrieveEmbed = new EmbedBuilder()
                .setTitle(`Retrieved Confession: ${confession_id}`)
                .setColor(`#C3B1E1`)
                .setDescription(`**Confession (${confession_id})**\n> ${confession_text}${confessionDocument.confession_attachment ? `\n\n**Attachment**\n${confession_attachment}\n\n` : '\n\n'}**Date**\n${confession_date}\n\n**Author**\n${confession_author} (${confession_author_id})\n\n**Guild**\n${guild_name} (${guild_id})\n\n${confessionDocument.message.isReply ? `**Is Reply**\n${confessionDocument.message.isReply}` : ''}`)

                await interaction.reply({ embeds: [retrieveEmbed]})
            }
        } else if (interaction.options.getSubcommand() == 'confession'){
            //ID Lookup
            const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
            const confessionDocument = await confession_data.findOne({ confession_id: givenConfessionID });
            if(confessionDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, flags: MessageFlags.Ephemeral  })
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
                            }, { context: { channelId: confessionDocument.message.channel_id, messageID: confessionDocument.message.id } })
                                .then(sentArray => {
                                    // Search for a non falsy value before providing feedback
                                    if (!sentArray.includes(true)) {
                                        return interaction.reply({content:`I'm sorry, I couldnt edit/delete that confession.`, flags: MessageFlags.Ephemeral  })
                                    }
                                    return interaction.reply({content:`That confession has been successfully edited/removed.` })
                                });
                        } catch (error) {
                            //Critical Error Catch
                            interaction.reply({content:`I'm sorry, there has been a error editing this confession.`, flags: MessageFlags.Ephemeral  })
                            return;
                        }
    
                    }
                    //Confession Ban Button
                    if (interaction.customId === 'confessions-ban') {   
                        let confessionBansArray = botDocument.user_confession_bans || []
                        let confession_author_id = confessionDocument.author.id;
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
            let replyMessage = await interaction.reply({ embeds: [quickMenuEmbed], components: [buttonRow], allowedMentions: {repliedUser: false}})
            setTimeout(async () => {
            try {
                client.removeListener(Events.InteractionCreate, interactionListener);
                const disabledRow = new ActionRowBuilder().addComponents(
                    confessionDeleteButton.setDisabled(true),
                    confessionBanButton.setDisabled(true),
                    confessionDismiss.setDisabled(true)
                );
                    await replyMessage.edit({ components: [disabledRow] });
                } catch (e) {
                    return;
                }
            }, 60_000);
        }
	},
}; 