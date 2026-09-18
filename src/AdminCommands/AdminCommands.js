const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags, Events, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } = require('discord.js')

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
                            { name: 'Warn', value: 'warn' },
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
                        .setName('id')
                        .setRequired(true)
                        .setDescription('The ID of your previous choice'))
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setRequired(true)
                        .setDescription('Provide an accurate reason')))
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
        let user_data = databaseCollections.user_data;
        //Command
        const botDocument = await bot_data.findOne({ type: 'prod' });
        if(botDocument==undefined) return interaction.reply({content:`I'm sorry, I cannot find the bot data document.`, flags: MessageFlags.Ephemeral  })
        const adminArray = botDocument.admins || [] 
        let index = adminArray.indexOf(`${interaction.member.user.id}`);
        if (index == -1) return await interaction.reply({content:"I'm sorry, this command can only be ran by the developers and admins of Meii.", flags: MessageFlags.Ephemeral  })
        const moderationType = interaction.options.getString('moderation_type');
        if (interaction.options.getSubcommand() === 'user'){ 
            //Check if User or Confession ID
            const moderationType = interaction.options.getString('moderation_type');
            const id_type = interaction.options.getString('id_type');
            const choiceId = interaction.options.getString('id').toUpperCase();
            const reason = interaction.options.getString('reason');
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
            //Warn User
            if(moderationType=='warn'){    
                await user_data.updateOne({ user_id: `${givenUserID}` }, {$push: {warnings: {reason: `${reason}`, date: new Date(), moderator: `${interaction.user.id}`}}},{ upsert: true });
                //Send DM
                try {
                    const user = await client.users.fetch(givenUserID);
                    let warnedEmbed = new EmbedBuilder()
                    .setTitle(`**Meii: Moderation Message**`)
                    .setColor("#ff6961")
                    .setDescription(`You have received a warning from the moderators of Meii. Continued violations may result in a ban or other moderation actions. \n\n **Reason:** \n > "${reason}" \n`)
                    .setFooter({text:`If you have any questions or would like to appeal, please join the support server and open a ticket.`})
                    await user.send({ embeds: [warnedEmbed] })
                } catch (e) {}    
                //Reply
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` has now been warned with the reason: **"${reason}"**.` })
            }
            //Confession Ban
            if(moderationType=='confessionban'){    
                let userDocument = await user_data.findOne({ user_id: givenUserID });
                if(userDocument?.ban_info?.isBanned) return await interaction.reply({ content:`This user is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                await user_data.updateOne({ user_id: `${givenUserID}` }, { $set: { ban_info: { isBanned: true, banReason: `${reason}`, moderator: `${interaction.user.id}`, "date": new Date()}}}, { upsert: true });
                //Send DM
                try {
                    const user = await client.users.fetch(givenUserID);
                    let isBannedEmbed = new EmbedBuilder()
                    .setTitle(`**Meii: Moderation Message**`)
                    .setColor("#ff6961")
                    .setDescription(`You have been globally **banned** from using the confession feature on Meii. \n\n **Reason:** \n > "${reason}" \n`)
                    .setFooter({text:`If you have any questions or would like to appeal, please join the support server and open a ticket.`})
                    await user.send({ embeds: [isBannedEmbed] })
                } catch (e) {}    
                //Reply
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using confessions with the reason: **"${reason}"**.` })
            }
            //Confession Unban
            if(moderationType=='confessionunban'){
                let userDocument = await user_data.findOne({ user_id: givenUserID });
                if (userDocument == undefined || !userDocument?.ban_info?.isBanned){
                    return await interaction.reply({ content:`This user isn't banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                }
                await user_data.updateOne({ user_id: `${givenUserID}` }, { $unset: { 'ban_info': ' '} });
                //Send DMc
                try {
                    const user = await client.users.fetch(givenUserID);
                    let isUnBannedEmbed = new EmbedBuilder()
                    .setTitle(`**Meii: Moderation Message**`)
                    .setColor("#ff6961")
                    .setDescription(`You have been globally **unbanned** from the confession feature on Meii. \n\n **Reason:** \n "${reason}" \n`)
                    .setFooter({text:`If you have any questions, please join the support server and open a ticket.`})
                    await user.send({ embeds: [isUnBannedEmbed] })
                } catch (e) {} 
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using confessions with the reason: **"${reason}"**.` })
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

            //Confession Ban Button
            const warnButton = new ButtonBuilder()
            .setCustomId('confessions-warn')
            .setLabel('Warn')
            .setStyle(ButtonStyle.Secondary);
            
            //Dismiss Button
            const confessionDismiss = new ButtonBuilder()
            .setCustomId('confessions-dismiss')
            .setLabel('Dismiss')
            .setStyle(ButtonStyle.Danger);
    
            //create button action row
            const buttonRow = new ActionRowBuilder().addComponents(confessionDeleteButton, confessionBanButton, warnButton, confessionDismiss)
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
                        let confession_author_id = confessionDocument.author.id;
                        let userDocument = await user_data.findOne({ user_id: confession_author_id });
                        if(userDocument?.ban_info?.isBanned) return await interaction.reply({ content:`This user is already banned from using confessions.`, flags: MessageFlags.Ephemeral  })
                        //Modal
                        const banModal = new ModalBuilder()
                        .setCustomId(`banModal-${interaction.user.id}`)
                        .setTitle(`Confession Ban`);
                        //Reason
                        const reasonInput = new TextInputBuilder()
                            .setCustomId('reasonInput')
                            .setStyle(TextInputStyle.Paragraph);

                        const reasonLabel = new LabelBuilder()
                            .setLabel("Reason")
                            .setDescription('Explain how they broke TOS or the rules. This will be shown to the user.')
                            .setTextInputComponent(reasonInput);

                        banModal.addLabelComponents(reasonLabel);
                        await interaction.showModal(banModal);

                        const filter = (interaction) => interaction.customId === `banModal-${interaction.user.id}`;

                        interaction.awaitModalSubmit({filter, time: 900000}).then(async (modalInteraction) => {
                            const reasonText = modalInteraction.fields.getTextInputValue('reasonInput');
                            await user_data.updateOne({ user_id: `${confession_author_id}` }, { $set: { ban_info: { isBanned: true, banReason: `${reasonText}`, moderator: `${interaction.user.id}`, "date": new Date()}}}, { upsert: true });
                            //Send DM
                            try {
                                const user = await client.users.fetch(confession_author_id);
                                let isBannedEmbed = new EmbedBuilder()
                                .setTitle(`**Meii: Moderation Message**`)
                                .setColor("#ff6961")
                                .setDescription(`You have been globally **banned** from using the confession feature on Meii. \n\n **Reason:** \n > "${reasonText}" \n`)
                                .setFooter({text:`If you have any questions or would like to appeal, please join the support server and open a ticket.`})
                                await user.send({ embeds: [isBannedEmbed] })
                            } catch (e) {}   
                            return modalInteraction.reply({content:`The user with the ID of \`${confession_author_id}\` is now banned from using confessions with the reason: **"${reasonText}"**.` })
                        }).catch((e) => {
                            console.error(e);
                            return
                        });                     
                    }
                    //Warn Button
                    if (interaction.customId === 'confessions-warn') { 
                        let confession_author_id = confessionDocument.author.id;
                        //Modal
                        const warnModal = new ModalBuilder()
                        .setCustomId(`warnModal-${interaction.user.id}`)
                        .setTitle(`Warn User`);
                        //Reason
                        const reasonInput = new TextInputBuilder()
                            .setCustomId('reasonInput')
                            .setStyle(TextInputStyle.Paragraph);

                        const reasonLabel = new LabelBuilder()
                            .setLabel("Reason")
                            .setDescription("Explain why you're warning them. This will be shown to the user.")
                            .setTextInputComponent(reasonInput);

                        warnModal.addLabelComponents(reasonLabel);
                        await interaction.showModal(warnModal);

                        const filter = (interaction) => interaction.customId === `warnModal-${interaction.user.id}`;

                        interaction.awaitModalSubmit({filter, time: 900000}).then(async (modalInteraction) => {
                            const reasonText = modalInteraction.fields.getTextInputValue('reasonInput');
                            await user_data.updateOne({ user_id: `${confession_author_id}` }, {$push: {warnings: {reason: `${reasonText}`, date: new Date(), moderator: `${interaction.user.id}`}}},{ upsert: true });
                            //Send DM
                            try {
                                const user = await client.users.fetch(confession_author_id);
                                let warnedEmbed = new EmbedBuilder()
                                .setTitle(`**Meii: Moderation Message**`)
                                .setColor("#ff6961")
                                .setDescription(`You have received a warning from the moderators of Meii. Continued violations may result in a ban or other moderation actions. \n\n **Reason:** \n > "${reasonText}" \n`)
                                .setFooter({text:`If you have any questions or would like to appeal, please join the support server and open a ticket.`})
                                await user.send({ embeds: [warnedEmbed] })
                            } catch (e) {}    
                            //Reply
                            return modalInteraction.reply({content:`The user with the ID of \`${confession_author_id}\` has now been warned with the reason: **"${reasonText}"**.` })
                        }).catch((e) => {
                            console.error(e);
                            return
                        });    
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
                    warnButton.setDisabled(true),
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