const {  TextDisplayBuilder, ContainerBuilder, Events, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('Customize the confessions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction, db, databaseCollections, client, shardCollections) {

        const customizeContainer = new ContainerBuilder()
            .setAccentColor(0xC3B1E1)
            //Title
            .addTextDisplayComponents(
                textDisplay => textDisplay
                .setContent('## **Meii: Customize**'),
                textDisplay => textDisplay
                .setContent('Please use the buttons below to customize confessions. Anything that is surrounded by `{}` is a auto-populated variable provided by Meii.'),
                )
            .addSeparatorComponents(
                separator => separator,
            )
            //Customize Confession Button
            .addActionRowComponents(
                actionRow => actionRow
                    .setComponents(
                        new ButtonBuilder()
                        .setCustomId('customize-confession')
                        .setLabel('Customize Confession Embed')
                        .setStyle(ButtonStyle.Primary)
                    ),
            )
            //Customize Confession Reply Button
            .addActionRowComponents(
                actionRow => actionRow
                    .setComponents(
                        new ButtonBuilder()
                        .setCustomId('customize-reply')
                        .setLabel('Customize Confession Reply Embed')
                        .setStyle(ButtonStyle.Primary)
                    ),
            )
            .addSeparatorComponents(
                separator => separator,
            )
            //Reset Customization button
            .addActionRowComponents(
                actionRow => actionRow
                    .setComponents(
                        new ButtonBuilder()
                        .setCustomId('customize-reset')
                        .setLabel('Reset Customization')
                        .setStyle(ButtonStyle.Danger)
                    ),
            )                
            .addSeparatorComponents(
                separator => separator,
            )                
            //Cancel/Done button
            .addActionRowComponents(
                actionRow => actionRow
                    .setComponents(
                        new ButtonBuilder()
                        .setCustomId('customize-cancel')
                        .setLabel('Done/Cancel')
                        .setStyle(ButtonStyle.Secondary)
                    ),
            )

        const guildDocument = await databaseCollections.server_data.find({ server_id: interaction.guild.id }).toArray();
        //Document Not Found
        let serverNotFound = new EmbedBuilder()
        .setTitle(`**Customization: Confessions Not Setup**`)
        .setColor("#ff6961")
        .setDescription(`I'm sorry, this server has not setup confessions.`)
        .setFooter({text:`You can set it up with /settings`})
        if(guildDocument[0]?.settings?.confession_channel_ids==undefined) return interaction.reply({embeds: [serverNotFound], flags: MessageFlags.Ephemeral  }); 

		await interaction.reply({
			flags: MessageFlags.IsComponentsV2,
			components: [customizeContainer],
		});  
        
        const interactionListener = async (interaction) => {
            if (!interaction.isMessageComponent()) return;
            if(interaction.message.interactionMetadata.user.id != interaction.user.id) return;
            //Database Collections
            let server_data = databaseCollections.server_data;
            //Command
            if(interaction.user.id !== interaction.message.interaction.user.id) return
            const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
            //Variables
            let defaultValues = { "title": "**:love_letter: Anonymous Confession** ({id})", "body": "> {confession}", "color": "{random}"}
            let dataExists = false;
            if(guildDocument[0]?.customization) dataExists = true;
            let titleData = guildDocument[0]?.customization?.title;
            let bodyData = guildDocument[0]?.customization?.body;
            let colorData = guildDocument[0]?.customization?.color;
            let defaultValuesReply = { "title": ":love_letter: Anonymous Reply to {reply_id}", "body": "> {confession}", "color": "{random}"}
            let dataExistsReply = false;
            if(guildDocument[0]?.customization_reply) dataExistsReply = true;
            let titleDataReply = guildDocument[0]?.customization_reply?.title;
            let bodyDataReply = guildDocument[0]?.customization_reply?.body;
            let colorDataReply = guildDocument[0]?.customization_reply?.color;

            //Customize Modal
            if (interaction.customId === 'customize-confession') { 
                //Modal
                const ccModal = new ModalBuilder()
                .setCustomId(`ccModal-${interaction.user.id}`)
                .setTitle('Confession Customization');
                //Title
                let titleString = dataExists ? titleData : defaultValues.title;
                if(titleString==undefined) titleString = defaultValues.title;
                const titleInput = new TextInputBuilder()
                .setCustomId('titleinput')
                .setLabel("Title | {id}")
                .setValue(titleString)
                .setStyle(TextInputStyle.Short);
                //Body
                let bodyString = dataExists ? bodyData : defaultValues.body;
                const bodyInput = new TextInputBuilder()
                .setCustomId('bodyinput')
                .setLabel("Body | {confession}")
                .setValue(bodyString)
                .setStyle(TextInputStyle.Short);
                //Color
                let colorString = dataExists ? colorData : defaultValues.color;
                const colorInput = new TextInputBuilder()
                .setCustomId('colorInput')
                .setLabel("Color (#hex-code) | {random}")
                .setValue(colorString)
                .setStyle(TextInputStyle.Short);
                //Action Rows
                const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
                const bodyActionRow = new ActionRowBuilder().addComponents(bodyInput);
                const colorActionRow = new ActionRowBuilder().addComponents(colorInput);
                //Add to Modal
                ccModal.addComponents(titleActionRow, bodyActionRow, colorActionRow);
                await interaction.showModal(ccModal);
                //Customize Modal Collector
                const filter = (interaction) => interaction.customId === `ccModal-${interaction.user.id}`;
                interaction.awaitModalSubmit({filter, time: 300000}).then(async (modalInteraction) => {
                    //Variables
                    const titleText = modalInteraction.fields.getTextInputValue('titleinput');
                    const bodyText = modalInteraction.fields.getTextInputValue('bodyinput');
                    const colorText = modalInteraction.fields.getTextInputValue('colorInput');
                    //Saved Container
                     const savedContainer = new ContainerBuilder()
                        .setAccentColor(0x77DD77)
                        .addTextDisplayComponents(
                            textDisplay => textDisplay
                            .setContent('## **Customization: Customization Saved**'),
                            textDisplay => textDisplay
                            .setContent('Your customizations have been saved. If something doesnt work, make sure you filled in the values correctly.'),
                            )
                    //Update Document
                    await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { customization: { "title":`${titleText}`, "body":`${bodyText}`, "color":`${colorText}` } } });
                    //Tell User Document Saved
                    await modalInteraction.update({flags: MessageFlags.IsComponentsV2, components: [savedContainer]});
                    client.removeListener(Events.InteractionCreate, interactionListener);
                    clearTimeout(autoRemoveTimeout);                    
                    return
                }).catch((e) => {
                    return
                }); 
            }else if(interaction.customId === 'customize-reply'){
                //Customize Relpy Embed Button
                //Modal
                const ReplyModal = new ModalBuilder()
                .setCustomId(`ReplyModal-${interaction.user.id}`)
                .setTitle('Confession Reply Customization');
                //Title
                let titleString = dataExistsReply ? titleDataReply : defaultValuesReply.title;
                const titleInput = new TextInputBuilder()
                .setCustomId('titleinput')
                .setLabel("Title | {reply_id} {id}")
                .setValue(titleString)
                .setStyle(TextInputStyle.Short);
                //Body
                let bodyString = dataExistsReply ? bodyDataReply : defaultValuesReply.body;
                const bodyInput = new TextInputBuilder()
                .setCustomId('bodyinput')
                .setLabel("Body | {confession}")
                .setValue(bodyString)
                .setStyle(TextInputStyle.Short);
                //Color
                let colorString = dataExistsReply ? colorDataReply : defaultValuesReply.color;
                const colorInput = new TextInputBuilder()
                .setCustomId('colorInput')
                .setLabel("Color (#hex-code) | {random}")
                .setValue(colorString)
                .setStyle(TextInputStyle.Short);
                //Action Rows
                const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
                const bodyActionRow = new ActionRowBuilder().addComponents(bodyInput);
                const colorActionRow = new ActionRowBuilder().addComponents(colorInput);
                //Add to Modal
                ReplyModal.addComponents(titleActionRow, bodyActionRow, colorActionRow);
                await interaction.showModal(ReplyModal);
                //Customize Modal Collector
                const filter = (interaction) => interaction.customId === `ReplyModal-${interaction.user.id}`;
                interaction.awaitModalSubmit({filter, time: 300000}).then(async (modalInteraction) => {
                    //Variables
                    const titleText = modalInteraction.fields.getTextInputValue('titleinput');
                    const bodyText = modalInteraction.fields.getTextInputValue('bodyinput');
                    const colorText = modalInteraction.fields.getTextInputValue('colorInput');
                    //Saved Container
                    const savedContainer = new ContainerBuilder()
                        .setAccentColor(0x77DD77)
                        .addTextDisplayComponents(
                            textDisplay => textDisplay
                            .setContent('## **Customization: Customization Saved**'),
                            textDisplay => textDisplay
                            .setContent('Your customizations have been saved. If something doesnt work, make sure you filled in the values correctly.'),
                        )
                    //Update Document
                    await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { customization_reply: { "title":`${titleText}`, "body":`${bodyText}`, "color":`${colorText}` } } });
                    //Tell User Document Saved
                    await modalInteraction.update({flags: MessageFlags.IsComponentsV2, components: [savedContainer]});
                    client.removeListener(Events.InteractionCreate, interactionListener);
                    clearTimeout(autoRemoveTimeout);
                    return
                }).catch((e) => {
                    client.removeListener(Events.InteractionCreate, interactionListener);
                    clearTimeout(autoRemoveTimeout);
                    return
                });
            }else if(interaction.customId === 'customize-reset'){
                //Reset Button
                const resetContainer = new ContainerBuilder()
                    .setAccentColor(0xff6961)
                    .addTextDisplayComponents(
                        textDisplay => textDisplay
                        .setContent('## **Customization: Customization Rest**'),
                        textDisplay => textDisplay
                        .setContent('Are you sure you want to reset any and all customizations? This will irreversibility reset any customizations to default.'),
                    )                
                    .addSeparatorComponents(
                        separator => separator,
                    )    
                    .addActionRowComponents(
                        actionRow => actionRow
                            .setComponents(
                                new ButtonBuilder()
                                .setCustomId('customize-resetConfirm')
                                .setLabel('Confirm')
                                .setStyle(ButtonStyle.Danger),

                                new ButtonBuilder()
                                .setCustomId('customize-cancel')
                                .setLabel('Cancel')
                                .setStyle(ButtonStyle.Secondary)
                            ),
                    )   
                return await interaction.update({flags: MessageFlags.IsComponentsV2, components: [resetContainer]});
            }else if(interaction.customId === 'customize-cancel'){
                //Cancel Button
                const CancelTextDisplay = new TextDisplayBuilder()
                    .setContent('Canceled.');
                await interaction.update({ flags: MessageFlags.IsComponentsV2, components: [CancelTextDisplay], ephermal: true});
                client.removeListener(Events.InteractionCreate, interactionListener);
                clearTimeout(autoRemoveTimeout);
                return
            }else if(interaction.customId === 'customize-resetConfirm'){
                //Confirm Reset Button
                //Reset in document
                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { customization: "" } });
                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { customization_reply: "" } });
                //Tell User it has been reset
                const resetConfirmContainer = new ContainerBuilder()
                    .setAccentColor(0x77DD77)
                    .addTextDisplayComponents(
                        textDisplay => textDisplay
                        .setContent('## **Customization: Customization Reset**'),
                        textDisplay => textDisplay
                        .setContent('our customizations have been reset. You can redo them by using `/customize`.'),
                    )                
                await interaction.update({flags: MessageFlags.IsComponentsV2, components: [resetConfirmContainer]});
                client.removeListener(Events.InteractionCreate, interactionListener);
                clearTimeout(autoRemoveTimeout);
                return
            }

        };

        client.on(Events.InteractionCreate, interactionListener);

        const autoRemoveTimeout = setTimeout(() => {
            client.removeListener(Events.InteractionCreate, interactionListener);
        }, 300000); // 5 minutes in milliseconds

	},
};




                //Customize not saving when removing

                //reply not showing changes
                //not saving when removing

                //Change hex default