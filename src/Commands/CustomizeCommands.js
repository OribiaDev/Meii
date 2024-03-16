const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionResponse } = require('discord.js')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('Customize the confessions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const confessioncustomize = new ButtonBuilder()
			.setCustomId(`customize-confession`)
			.setLabel('Customize Confession Embed')
			.setStyle(ButtonStyle.Primary);
        const replycustomize = new ButtonBuilder()
            .setCustomId(`customize-reply`)
            .setLabel('Customize Confession Reply Embed')
            .setStyle(ButtonStyle.Primary);
		const reset = new ButtonBuilder()
			.setCustomId('customize-reset')
			.setLabel('Reset Customization')
			.setStyle(ButtonStyle.Danger);
        const cancel = new ButtonBuilder()
        .setCustomId('customize-cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(confessioncustomize, replycustomize, reset, cancel);
		await interaction.reply({
			content: `Please select an option..`,
			components: [row],
		});        
	},
    async handleButton(interaction, db, databaseCollections) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        //Command
        if(interaction.user.id !== interaction.message.interaction.user.id) return interaction.reply({content:"Im sorry, you cannot use this button!", ephemeral: true })
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
        if(guildDocument[0]?.customization_reply) dataExists = true;
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
            .setLabel("Color (#Hex-Code) | {random}")
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
                //Document Not Found
                let serverNotFound = new EmbedBuilder()
                .setTitle(`**Customization: Server Not Found**`)
                .setColor("#ff6961")
                .setDescription(`I'm sorry, this server hasnt setup confessions.`)
                .setFooter({text:`You can set it up with /set`})
                if(guildDocument[0]==undefined) return modalInteraction.update({content: "", embeds: [serverNotFound], components: [], ephemeral: true }); 
                //Check if values are default 
                if(titleText == defaultValues.title && bodyText == defaultValues.body && colorText == defaultValues.color){
                    //Values Default
                    let customizationSaved = new EmbedBuilder()
                    .setTitle(`**Customization: Customization Saved**`)
                    .setColor("#77DD77")
                    .setDescription(`Your customizations have been saved.`)
                    .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                    await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
                    return
                }
                //Check if values are in database
                if(titleText == titleData && bodyText == bodyData && colorText == colorData ){
                    //Values Same
                    let customizationSaved = new EmbedBuilder()
                    .setTitle(`**Customization: Customization Saved**`)
                    .setColor("#77DD77")
                    .setDescription(`Your customizations have been saved.`)
                    .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                    await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
                    return
                }
                //Update Document
                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { customization: { "title":`${titleText}`, "body":`${bodyText}`, "color":`${colorText}` } } });
                //Tell User Document Saved
                let customizationSaved = new EmbedBuilder()
                .setTitle(`**Customization: Customization Saved**`)
                .setColor("#77DD77")
                .setDescription(`Your customizations have been saved.`)
                .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
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
            .setLabel("Title | {reply_id}, {id}")
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
            .setLabel("Color (#Hex-Code) | {random}")
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
                //Document Not Found
                let serverNotFound = new EmbedBuilder()
                .setTitle(`**Customization: Server Not Found**`)
                .setColor("#ff6961")
                .setDescription(`I'm sorry, this server hasnt setup confessions.`)
                .setFooter({text:`You can set it up with /set`})
                if(guildDocument[0]==undefined) return modalInteraction.update({content: "", embeds: [serverNotFound], components: [], ephemeral: true }); 
                //Check if values are default 
                if(titleText == defaultValuesReply.title && bodyText == defaultValuesReply.body && colorText == defaultValuesReply.color){
                    //Values Default
                    let customizationSaved = new EmbedBuilder()
                    .setTitle(`**Customization: Customization Saved**`)
                    .setColor("#77DD77")
                    .setDescription(`Your customizations have been saved.`)
                    .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                    await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
                    return
                }
                //Check if values are in database
                if(titleText == titleDataReply && bodyText == bodyDataReply && colorText == colorDataReply ){
                    //Values Same
                    let customizationSaved = new EmbedBuilder()
                    .setTitle(`**Customization: Customization Saved**`)
                    .setColor("#77DD77")
                    .setDescription(`Your customizations have been saved.`)
                    .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                    await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
                    return
                }
                //Update Document
                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { customization_reply: { "title":`${titleText}`, "body":`${bodyText}`, "color":`${colorText}` } } });
                //Tell User Document Saved
                let customizationSaved = new EmbedBuilder()
                .setTitle(`**Customization: Customization Saved**`)
                .setColor("#77DD77")
                .setDescription(`Your customizations have been saved.`)
                .setFooter({text:"If something doesnt work, make sure you filled in the values correctly!"})  
                await modalInteraction.update({content: ``, embeds: [customizationSaved], components: []});
                return
            }).catch((e) => {
                return
            });
        }else if(interaction.customId === 'customize-reset'){
            //Reset Button
            //Check if document exists
            let serverNotFound = new EmbedBuilder()
            .setTitle(`**Customization: Server Not Found**`)
            .setColor("#ff6961")
            .setDescription(`I'm sorry, this server hasnt setup confessions.`)
            .setFooter({text:`You can set it up with /set`})
            if(guildDocument[0]==undefined) return interaction.update({content: "", embeds: [serverNotFound], components: [], ephemeral: true }); 
            const confirmButton = new ButtonBuilder()
            .setCustomId('customize-resetConfirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Danger);
            const cancelButton = new ButtonBuilder()
            .setCustomId('customize-cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);
            await interaction.update({content: `Are you sure you want to reset any and all customizations? \nThis will irreversibility reset any customizations to default.`, components: [row], });
        }else if(interaction.customId === 'customize-cancel'){
            //Cancel Button
            await interaction.update({content: `cancelled.`, components: [], ephermal: true})
            return
        }else if(interaction.customId === 'customize-resetConfirm'){
            //Confirm Reset Button
            //Reset in document
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { customization: "" } });
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { customization_reply: "" } });
            //Tell User it has been reset
            let customizationReset = new EmbedBuilder()
            .setTitle(`**Customization: Customization Reset**`)
            .setColor("#77DD77")
            .setDescription(`Your customizations have been reset.`)
            .setFooter({text:"You can redo them by using /customize"})  
            await interaction.update({content: ``, embeds: [customizationReset], components: []});
            return
        }
	},
};


