const { MessageFlags, Events, TextDisplayBuilder, ContainerBuilder, ChannelSelectMenuBuilder, ChannelType, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('All the customizable settings for Meii')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

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
            let preselectedConfessionChannelIds = guildDocument[0]?.settings?.confession_channel_ids;       
            let preselectedChannelId = guildDocument[0]?.settings?.confession_log_channel_id;
            let preselectedConfessionLogChannelId = guildDocument[0]?.settings?.confession_log_channel_id;
            let attachmentToggle = guildDocument[0]?.settings?.attachment_toggle;  
            let confessionchannelcheck = false;
            //Check if Confession Setup
            if(preselectedChannelIds==undefined){
                preselectedChannelIds="**Channel Not Setup**"
                confessionchannelcheck = true;
                preselectedConfessionChannelIds=[];
            }else{
                preselectedChannelIds = preselectedChannelIds.map(id => `<#${id}>`).join(', ')
            }
            //Check if Confession Log Setup
            if(preselectedChannelId==undefined){
                preselectedChannelId="**Channel Not Setup**"
                preselectedConfessionLogChannelId=[];
            }else{
                preselectedChannelId = `<#${preselectedChannelId}>`
            }
            //Create Container 
            const settingsContainer = new ContainerBuilder()
                .setAccentColor(0xC3B1E1)
                //Titles
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent('## **Utility: Settings**'),
                    textDisplay => textDisplay
			        .setContent('Please use the dropdown menu and buttons below to configure Meii. Make sure Meii has permission to send messages, or these wont work!'),
	            )
                .addSeparatorComponents(
                    separator => separator,
                )
                //Confession Channels
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent(' ### **Confession Channel(s)**'),
                    textDisplay => textDisplay
			        .setContent('Use the dropdown menu to select or remove one or more confession channels. If you select multiple channels, there will be an option at the end of the confession command to select which channel you want to use.'),
	            )
                .addTextDisplayComponents(
                    textDisplay => textDisplay
                        .setContent(preselectedChannelIds),
	            )
                .addActionRowComponents(
                    actionRow => actionRow
                        .setComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('confession_channel_select')
                                .setDefaultChannels(preselectedConfessionChannelIds)
                                .setPlaceholder('Select one or more channels')
                                .setMinValues(0)
                                .setMaxValues(25)
                                .addChannelTypes(
                                    ChannelType.GuildText
                                ),
                        ),
                )
                .addSeparatorComponents(
                    separator => separator,
                )
                //Confession Logging Channel
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent(' ### **Confession Logging Channel**'),
                    textDisplay => textDisplay
			        .setContent('Use the dropdown menu to select or remove a confession log channel.'),
	            )
                .addTextDisplayComponents(
                    textDisplay => textDisplay
                        .setContent(preselectedChannelId),
	            )
                .addActionRowComponents(
                    actionRow => actionRow
                        .setComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('confession_log_channel_select')
                                .setDefaultChannels(preselectedConfessionLogChannelId)
                                .setPlaceholder('Select a channel.')
                                .setMinValues(0)
                                .setMaxValues(1)
                                .setDisabled(confessionchannelcheck)
                                .addChannelTypes(
                                    ChannelType.GuildText
                                ),
                        ),
                )
                .addSeparatorComponents(
                    separator => separator,
                )
                //Attachment Toggles
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent(' ### **Confession Attachments**'), 
                    textDisplay => textDisplay
			        .setContent('Use the buttons below to toggle the use of attachments in confessions. Please note attatchments are **enabled by default**.'),
	            )
                .addActionRowComponents(
                    actionRow => actionRow
                        .setComponents(
                            new ButtonBuilder()
                            .setCustomId('settings-attachment-enable')
                            .setLabel('Enable')
                            .setDisabled(confessionchannelcheck || attachmentToggle)
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('settings-attachment-disable')
                            .setLabel('Disable')
                            .setDisabled(confessionchannelcheck || !attachmentToggle)
                            .setStyle(ButtonStyle.Danger)
                        ),
                )
                .addSeparatorComponents(
                    separator => separator,
                )
                //Cancel Button
                .addActionRowComponents(
                    actionRow => actionRow
                        .setComponents(
                            new ButtonBuilder()
                            .setCustomId('settings-cancel')
                            .setLabel('Done/Cancel')
                            .setStyle(ButtonStyle.Danger)
                        ),
                )

            return {
                flags: MessageFlags.IsComponentsV2,
                components: [settingsContainer],
            };
        },

        async execute(interaction, db, databaseCollections, client, shardCollections) {
            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
            await interaction.reply({ flags: flags, components: components});
            //Component Handler
            const interactionListener = async (interaction) => {
                let server_data = databaseCollections.server_data;
                let guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
                if (!interaction.isMessageComponent()) return;
                if(interaction.message.interactionMetadata.user.id != interaction.user.id) return;
                //Buttons
                if(interaction.isButton()){
                    //Confession Attachment Enable Button Handler
                    if (interaction.customId === 'settings-attachment-enable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.attachment_toggle': true } });
                        const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ flags: flags, components: components});
                    }
                    //Confession Attachment Disable Button Handler
                    if (interaction.customId === 'settings-attachment-disable') { 
                        await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.attachment_toggle': false } });
                        const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                        await interaction.update({ flags: flags, components: components});
                    }
                    if(interaction.customId === 'settings-cancel'){
                        //Cancel Button
                        const CancelTextDisplay = new TextDisplayBuilder()
	                        .setContent('Completed :)');
                        await interaction.update({ flags: MessageFlags.IsComponentsV2, components: [CancelTextDisplay]});
                        client.removeListener(Events.InteractionCreate, interactionListener);
                        clearTimeout(autoRemoveTimeout);
                        return
                    }
                }
                //Channel Menu Handler
                if(interaction.isChannelSelectMenu()){
                    //Confession Channel Menu
                    if(interaction.customId === 'confession_channel_select'){
                        let confessionChannelIDs = interaction.values;
                        //Check if nothing is selected
                        if(!confessionChannelIDs || confessionChannelIDs.length === 0){
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { 'settings.confession_channel_ids': ' ' } });
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }else{
                            if(guildDocument[0]?.settings===undefined){
                                //Add attachment Toggle
                                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { settings: { attachment_toggle: true, confession_channel_ids: confessionChannelIDs } } });
                            }else{
                                //Ignore attachment Toggle
                                await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.confession_channel_ids': confessionChannelIDs } });
                            }
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }
                    }
                    if(interaction.customId === 'confession_log_channel_select'){
                        let confessionChannelID = interaction.values;
                        //Check if nothing is selected
                        if(!confessionChannelID || confessionChannelID.length === 0){
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { 'settings.confession_log_channel_id': ' '} });
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }else{
                            let confessionChannelID = interaction.values.toString();
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.confession_log_channel_id': confessionChannelID } });
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }
                    }

                }
            };
            
            client.on(Events.InteractionCreate, interactionListener);

            const autoRemoveTimeout = setTimeout(() => {
                client.removeListener(Events.InteractionCreate, interactionListener);
            }, 300000); // 5 minutes in milliseconds

	},

};