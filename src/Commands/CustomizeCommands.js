const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionResponse } = require('discord.js')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('customize')
		.setDescription('Customize the confessions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const confessioncustomize = new ButtonBuilder()
			.setCustomId(`cc-customize`)
			.setLabel('Customize Confession Embed')
			.setStyle(ButtonStyle.Primary);
		const reset = new ButtonBuilder()
			.setCustomId('reset-customize')
			.setLabel('Reset Customization')
			.setStyle(ButtonStyle.Danger);
        const cancel = new ButtonBuilder()
        .setCustomId('cancel-customize')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(confessioncustomize, reset, cancel);
		await interaction.reply({
			content: `Please select an option..`,
			components: [row],
		});        
	},
    async handleButton(interaction, db, server_data) {
        if(interaction.user.id !== interaction.message.interaction.user.id) return interaction.reply({content:"Im sorry, you cannot use this button!", ephemeral: true })
        const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
        //Variables
        let defaultValues = { "title": "**:love_letter: Anonymous Confession**", "body": "> {confession}", "footer": "Meii", "color": "{random}"}
        let dataExists = false;
        if(guildDocument[0].customization) dataExists = true;
        let titleData = guildDocument[0]?.customization?.title;
        let bodyData = guildDocument[0]?.customization?.body;
        let footerData = guildDocument[0]?.customization?.footer;
        let colorData = guildDocument[0]?.customization?.color;
        //Customize Modal
        if (interaction.customId === 'cc-customize') { 
            //Modal
            const ccModal = new ModalBuilder()
            .setCustomId(`ccModal-${interaction.user.id}`)
            .setTitle('Confession Customization');
            //Title
            let titleString = dataExists ? titleData : defaultValues.title;
            const titleInput = new TextInputBuilder()
            .setCustomId('titleinput')
            .setLabel("Title")
            .setValue(titleString)
            .setStyle(TextInputStyle.Short);
            //Body
            let bodyString = dataExists ? bodyData : defaultValues.body;
            const bodyInput = new TextInputBuilder()
            .setCustomId('bodyinput')
            .setLabel("Body | {confession}")
            .setValue(bodyString)
            .setStyle(TextInputStyle.Short);
            //Footer
            let footerString = dataExists ? footerData : defaultValues.footer;
            const footerInput = new TextInputBuilder()
            .setCustomId('footerinput')
            .setLabel("Footer")
            .setValue(footerString)
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
            const footerActionRow = new ActionRowBuilder().addComponents(footerInput);
            const colorActionRow = new ActionRowBuilder().addComponents(colorInput);
            //Add to Modal
            ccModal.addComponents(titleActionRow, bodyActionRow, footerActionRow, colorActionRow);
            await interaction.showModal(ccModal);
            //Customize Modal Collector
            const filter = (interaction) => interaction.customId === `ccModal-${interaction.user.id}`;
            interaction.awaitModalSubmit({filter, time: 300000}).then(async (modalInteraction) => {
                //Variables
                const titleText = modalInteraction.fields.getTextInputValue('titleinput');
                const bodyText = modalInteraction.fields.getTextInputValue('bodyinput');
                const footerText = modalInteraction.fields.getTextInputValue('footerinput');
                const colorText = modalInteraction.fields.getTextInputValue('colorInput');
                //Document Not Found
                let serverNotFound = new EmbedBuilder()
                .setTitle(`**Customization: Server Not Found**`)
                .setColor("#ff6961")
                .setDescription(`I'm sorry, this server hasnt setup confessions.`)
                .setFooter({text:`You can set it up with /set`})
                if(guildDocument[0]==undefined) return modalInteraction.update({content: "", embeds: [serverNotFound], components: [], ephemeral: true }); 
                //Check if values are default 
                if(titleText == defaultValues.title && bodyText == defaultValues.body && footerText == defaultValues.footer && colorText == defaultValues.color){
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
                if(titleText == titleData && bodyText == bodyData && footerText == footerData && colorText == colorData ){
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
                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { customization: { "title":`${titleText}`, "body":`${bodyText}`, "footer":`${footerText}`, "color":`${colorText}` } } });
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
        }else if(interaction.customId === 'reset-customize'){
            //Reset Button
            //Check if document exists
            let serverNotFound = new EmbedBuilder()
            .setTitle(`**Customization: Server Not Found**`)
            .setColor("#ff6961")
            .setDescription(`I'm sorry, this server hasnt setup confessions.`)
            .setFooter({text:`You can set it up with /set`})
            if(guildDocument[0]==undefined) return interaction.update({content: "", embeds: [serverNotFound], components: [], ephemeral: true }); 
            const confirmButton = new ButtonBuilder()
            .setCustomId('resetConfirm-customize')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Danger);
            const cancelButton = new ButtonBuilder()
            .setCustomId('cancel-customize')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);
            await interaction.update({content: `Are you sure you want to reset any and all customizations? \nThis will irreversibility reset any customizations to default.`, components: [row], });
        }else if(interaction.customId === 'cancel-customize'){
            //Cancel Button
            await interaction.update({content: `cancelled.`, components: [], ephermal: true})
            return
        }else if(interaction.customId === 'resetConfirm-customize'){
            //Confirm Reset Button
            //Reset in document
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { customization: "" } });
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


