const { Events, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ChannelType  } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('All the customizable settings for Meii')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

        async generateConfessionChannelEmbed(interaction, db, databaseCollections, client, shardCollections){
                //Get Channels from DB
                let server_data = databaseCollections.server_data;
                let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();

                //Preselected Channels Array
                let preselectedChannelIds = guildDocument[0]?.settings?.confession_channel_ids;            
                //Fetch all channels
                const channels = interaction.guild.channels.cache;
                //Filter for number of channels
                // Create the select menu
                let maxNumber = 0;
                channels.forEach((channel) => {
                    if (channel.isTextBased()) {
                        if(channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) && channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                            maxNumber++;
                        }
                    }
                });
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('confession_channel_select')
                    .setPlaceholder('Select one or more channels')
                    .setMinValues(1)
                    .setMaxValues(maxNumber);
                // Loop through channels and add them to the menu
                channels.forEach((channel) => {
                    if (channel.isTextBased()) {
                        if(channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) && channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                            selectMenu.addOptions({
                                label: `#${channel.name}`,
                                value: channel.id,
                                default: preselectedChannelIds?.includes(channel.id), // Preselect if channel ID is in the array
                            });
                        }
                    }
                });

                //Back Button
                const backButton = new ButtonBuilder()
                .setCustomId('settings-back')
                .setLabel('Back')
                .setStyle(ButtonStyle.Secondary);

                //Disable Button
                const confessionDisableButton = new ButtonBuilder()
                .setCustomId('settings-confessions-disable')
                .setLabel('Disable/Reset')
                .setStyle(ButtonStyle.Danger);

                // Create menu ac tion row
                const menuRow = new ActionRowBuilder().addComponents(selectMenu)
                //create button action row
                const buttonRow = new ActionRowBuilder().addComponents(confessionDisableButton, backButton)

                if(preselectedChannelIds==undefined){
                    preselectedChannelIds="Not Setup"
                }else{
                    preselectedChannelIds = preselectedChannelIds.map(id => `<#${id}>`).join(', ')
                }

                let ConfessionChannelEmbeds = new EmbedBuilder()
                .setColor("#C3B1E1")
                .setTitle("**Settings: Confession Channels**")
                .setDescription(`Use the dropdown menu to select one or more confession channels. \n\n If you select multiple confession channels, there will be an option at the end of the confession command to select what channel you want to use. \n\n If the channel you're wanting to use isnt showing up, make sure Meii has permissions to use it!`)
                .addFields(
                    { name: '\u200B', value: ' ' },
                    { name: '**Confession Channel(s)**', value: preselectedChannelIds, inline: true }, 
                    { name: '\u200B', value: ' ' },
                )

            return {
                embed: [ConfessionChannelEmbeds],
                components: [menuRow, buttonRow],
            };
        },

        async generateConfessionLogChannelEmbed(interaction, db, databaseCollections, client, shardCollections){
            //Get Channels from DB
            let server_data = databaseCollections.server_data;
            let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();

            //Preselected Channels Array
            let preselectedChannelId = guildDocument[0]?.settings?.confession_log_channel_id;            
            //Fetch all channels
            const channels = interaction.guild.channels.cache;
            // Create the select menu
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('confession_log_channel_select')
                .setPlaceholder('Select a channel')
                .setMinValues(1)
                .setMaxValues(1);
            // Loop through channels and add them to the menu
            channels.forEach((channel) => {
                if (channel.isTextBased()) {
                    if(channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) && channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                        selectMenu.addOptions({
                            label: `#${channel.name}`,
                            value: channel.id,
                            default: channel.id === preselectedChannelId
                        });
                    }
                }
            });

            //Back Button
            const backButton = new ButtonBuilder()
            .setCustomId('settings-back')
            .setLabel('Back')
            .setStyle(ButtonStyle.Secondary);

            //Disable Button
            const confessionlogDisableButton = new ButtonBuilder()
            .setCustomId('settings-confession-log-disable')
            .setLabel('Disable/Reset')
            .setStyle(ButtonStyle.Danger);

            // Create menu action row
            const menuRow = new ActionRowBuilder().addComponents(selectMenu)
            //create button action row
            const buttonRow = new ActionRowBuilder().addComponents(confessionlogDisableButton, backButton)

            if(preselectedChannelId==undefined){
                preselectedChannelId="Not Setup"
            }else{
                preselectedChannelId = `<#${preselectedChannelId}>`
            }

            let ConfessionLogChannelEmbeds = new EmbedBuilder()
            .setColor("#C3B1E1")
            .setTitle("**Settings: Confession Log Channel**")
            .setDescription(`Use the dropdown menu to select a confession log channel. \n\n If the channel you're wanting to use isnt showing up, make sure Meii has permissions to use it!`)
            .addFields(
                { name: '\u200B', value: ' ' },
                { name: '**Confession Log Channel**', value: preselectedChannelId, inline: true }, 
                { name: '\u200B', value: ' ' },
            )

            return {
            embed: [ConfessionLogChannelEmbeds],
            components: [menuRow, buttonRow],
            };
        },

        async generateAttachmentEmbed(interaction, db, databaseCollections, client, shardCollections){
            //Get Channels from DB

            let server_data = databaseCollections.server_data;
            let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();

            //Attachment Status
            let attachmentStatus = guildDocument[0]?.settings?.attachment_toggle;            
            //Create Buttons
            //Enable Button
            const enableButton = new ButtonBuilder()
            .setCustomId('settings-attachment-enable')
            .setLabel('Enable Attachments')
            .setStyle(ButtonStyle.Success)
            .setDisabled(attachmentStatus);

            //Disable Button
            const disableButton = new ButtonBuilder()
            .setCustomId('settings-attachment-disable')
            .setLabel('Disable Attachments')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(!attachmentStatus);

            //Back Button
            const backButton = new ButtonBuilder()
            .setCustomId('settings-back')
            .setLabel('Back')
            .setStyle(ButtonStyle.Secondary);

            //Attachment Status String
            let AttachmentStatusString;
            if(attachmentStatus){
                AttachmentStatusString = 'Enabled';
            }else{
                AttachmentStatusString = 'Disabled';
            }

            //create button action row
            const buttonRow = new ActionRowBuilder().addComponents(enableButton, disableButton, backButton)
            let ConfessionAttachmentEmbed = new EmbedBuilder()
            .setColor("#C3B1E1")
            .setTitle("**Settings: Confession Attachments**")
            .setDescription(`Use the buttons below to toggle attachments in confessions. \n\n __Please Note:__ Attachments are enabled by default.`)
            .addFields(
                { name: '\u200B', value: ' ' },
                { name: '**Confession Attachments**', value: `${AttachmentStatusString}`, inline: true }, 
                { name: '\u200B', value: ' ' },
            )
            return {
                embed: [ConfessionAttachmentEmbed],
                components: [buttonRow],
            };
        },

        async generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections){
            // Database collections and document logic
            let server_data = databaseCollections.server_data;
            let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
            if (guildDocument[0] == undefined) {
                await server_data.insertOne({ "server_id": `${interaction.guild.id}` });
                console.log(`(Shard ${shardCollections.shardID}): New Database Document Created with GuildID: ${interaction.guild.id}`);
            }
            //Get Vars
            let preselectedChannelIds = guildDocument[0]?.settings?.confession_channel_ids;
            let preselectedChannelId = guildDocument[0]?.settings?.confession_log_channel_id;
            let attachmentToggle = guildDocument[0]?.settings?.attachment_toggle;  
            let confessionchannelcheck = false;
            //Check if Confession Setup
            if(preselectedChannelIds==undefined){
                preselectedChannelIds="Not Setup"
                confessionchannelcheck = true;
            }else{
                preselectedChannelIds = preselectedChannelIds.map(id => `<#${id}>`).join(', ')
            }
            //Check if Confession Log Setup
            if(preselectedChannelId==undefined){
                preselectedChannelId="Not Setup"
            }else{
                preselectedChannelId = `<#${preselectedChannelId}>`
            }
            if(attachmentToggle==undefined){
                attachmentToggle="Not Setup"
            }else if(attachmentToggle==true){
                attachmentToggle = "Enabled"
            }else if(attachmentToggle==false){
                attachmentToggle = "Disabled"
            }
            //Create Buttons
            const settingsconfessionchannel = new ButtonBuilder()
                .setCustomId('settings-confession-channels')
                .setLabel('Set Confession Channels')
                .setStyle(ButtonStyle.Primary);
                

            const settingsconfessionlogchannel = new ButtonBuilder()
                .setCustomId('settings-confession-log-channel')
                .setLabel('Set Confession Log Channel')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(confessionchannelcheck);

            const settingsconfessionattachment = new ButtonBuilder()
                .setCustomId('settings-confession-attachment')
                .setLabel('Toggle Confession Attachments')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(confessionchannelcheck);

            const cancel = new ButtonBuilder()
                .setCustomId('settings-cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger);

            const settingsRow = new ActionRowBuilder()
                .addComponents(settingsconfessionchannel, settingsconfessionlogchannel);

            const settingsRow2 = new ActionRowBuilder()
                .addComponents(settingsconfessionattachment, cancel);

            let SettingsEmbed = new EmbedBuilder()
                .setColor("#C3B1E1")
                .setTitle("**Utility: Settings**")
                .setDescription(`Below are the customizable settings for Meii. \n\n Please use the buttons at the bottom to customize them!`)
                .addFields(
                    { name: '\u200B', value: ' ' },
                    { name: '**Confession Channels**', value: preselectedChannelIds, inline: true },
                    { name: '**Confession Log Channel**', value: preselectedChannelId, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Confession Attachments **', value: attachmentToggle, inline: true },
                    { name: '\u200B', value: ' ' },
                );

            return {
                embed: [SettingsEmbed],
                components: [settingsRow, settingsRow2],
            };
        },

        async execute(interaction, db, databaseCollections, client, shardCollections) {

            const { embed, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
            await interaction.reply({ embeds: embed, components: components});

            //Component Handler
            const interactionListener = async (interaction) => {
                let server_data = databaseCollections.server_data;
                let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
                if (!interaction.isMessageComponent()) return;
                //Buttons
                if(interaction.isButton()){
                    //Set Confession Channels
                    if (interaction.customId === 'settings-confession-channels') { 
                        const { embed, components } = await this.generateConfessionChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Set Confession Log Channels
                    if (interaction.customId === 'settings-confession-log-channel') { 
                        const { embed, components } = await this.generateConfessionLogChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Set Confession Attachment
                    if (interaction.customId === 'settings-confession-attachment') { 
                        const { embed, components } = await this.generateAttachmentEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components})
                    }
                    //Confession Disable Button Handler
                    if (interaction.customId === 'settings-confessions-disable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { 'settings.confession_channel_ids': ' ' } });
                        const { embed, components } = await this.generateConfessionChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Confession Logs Disable Button Handler
                    if (interaction.customId === 'settings-confession-log-disable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { 'settings.confession_log_channel_id': ' '} });
                        const { embed, components } = await this.generateConfessionLogChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Confession Attachment Enable Button Handler
                    if (interaction.customId === 'settings-attachment-enable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.attachment_toggle': true } });
                        const { embed, components } = await this.generateAttachmentEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Confession Attachment Disable Button Handler
                    if (interaction.customId === 'settings-attachment-disable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.attachment_toggle': false } });
                        const { embed, components } = await this.generateAttachmentEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Back Button Handler
                    if (interaction.customId === 'settings-back') {
                        const { embed, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    if(interaction.customId === 'settings-cancel'){
                        //Cancel Button
                        await interaction.update({content: `cancelled.`, embeds: [], components: [], ephermal: true})
                        client.removeListener(Events.InteractionCreate, interactionListener);
                        clearTimeout(autoRemoveTimeout);
                        return
                    }
        
                }
                //String Menu Handler
                if(interaction.isStringSelectMenu()){
                    //Confession Channel Menu
                    if(interaction.customId === 'confession_channel_select'){
                        let confessionChannelIDs = interaction.values;
                        if(guildDocument[0]?.settings===undefined){
                            //Add attachment Toggle
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { settings: { attachment_toggle: true, confession_channel_ids: confessionChannelIDs } } });
                        }else{
                            //Ignore attachment Toggle
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.confession_channel_ids': confessionChannelIDs } });
                        }
                        const { embed, components } = await this.generateConfessionChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                    //Confession Channel Menu
                    if(interaction.customId === 'confession_log_channel_select'){
                        let confessionChannelID = interaction.values.toString();
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.confession_log_channel_id': confessionChannelID } });
                        const { embed, components } = await this.generateConfessionLogChannelEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ embeds: embed, components: components});
                    }
                } 


            };
            
            client.on(Events.InteractionCreate, interactionListener);

            const autoRemoveTimeout = setTimeout(() => {
                client.removeListener(Events.InteractionCreate, interactionListener);
            }, 300000); // 5 minutes in milliseconds

	},

};