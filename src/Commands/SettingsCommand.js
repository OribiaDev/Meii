const { MessageFlags, Events, TextDisplayBuilder, ContainerBuilder, ChannelSelectMenuBuilder, ChannelType, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('All the customizable settings for Meii')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

        async generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections){
            // Database collections and document logic
            let server_data = databaseCollections.server_data;
            let guildDocument = await server_data.findOne({ server_id: interaction.guild.id });
            if (guildDocument == undefined) {
                await server_data.insertOne({ "server_id": `${interaction.guild.id}` });
                console.log(`(Shard ${shardCollections.shardID}): New Database Document Created with GuildID: ${interaction.guild.id}`);
            }
            //Get Vars
            let preselectedChannelIds = guildDocument?.settings?.confession_channel_ids;
            let preselectedConfessionChannelIds = guildDocument?.settings?.confession_channel_ids;       
            let preselectedChannelId = guildDocument?.settings?.confession_log_channel_id;
            let preselectedConfessionLogChannelId = guildDocument?.settings?.confession_log_channel_id;
            let attachmentToggle = guildDocument?.settings?.attachment_toggle;  
            let preselectedReviewChannelId = guildDocument?.settings?.confession_review_channel_id;
            let preselectedConfessionReviewChannelId = guildDocument?.settings?.confession_review_channel_id;
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
            //Check if Approval Setup
            if(preselectedReviewChannelId==undefined){
                preselectedReviewChannelId="**Channel Not Setup**"
                preselectedConfessionReviewChannelId=[];
            }else{
                preselectedReviewChannelId = `<#${preselectedReviewChannelId}>`
            }
            //Create Container 
            const settingsContainer = new ContainerBuilder()
                .setAccentColor(0xC3B1E1)
                //Titles
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent('## **Utility: Settings**'),
                    textDisplay => textDisplay
			        .setContent('Please use the dropdown menu and buttons below to configure Meii. Make sure Meii has the permissions "send messages", "view channel", and "embed links" or these wont work!'),
	            )
                .addSeparatorComponents(
                    separator => separator,
                )
                //Confession Channels
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent(' ### **Confession Channel(s)**'),
                    textDisplay => textDisplay
			        .setContent('Use the dropdown menu to select or remove one or more confession channels. If multiple channels are selected, users will be able to choose which channel to post to when submitting a confession.'),
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
                //Confession Review
                .addTextDisplayComponents(
		            textDisplay => textDisplay
			        .setContent(' ### **Confession Review Channel**'),
                    textDisplay => textDisplay
			        .setContent('Use the dropdown menu to select a channel for confession review. Confessions will be sent to this channel first, where they can be approved or denied before being posted publicly.')
	            )
                .addTextDisplayComponents(
                    textDisplay => textDisplay
                        .setContent(preselectedReviewChannelId),
	            )
                .addActionRowComponents(
                    actionRow => actionRow
                        .setComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('confession_review_select')
                                .setDefaultChannels(preselectedConfessionReviewChannelId)
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
			        .setContent('Use the buttons below to toggle the use of attachments in confessions. Please note attachments are **enabled by default**.'),
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
            const reply = await interaction.reply({ flags, components, withResponse: true, });
            const message = await interaction.fetchReply();
            const interactionOwnerID = interaction.user.id;
            const settingsCollector  = message.createMessageComponentCollector({
                time: 300000,
            });
            settingsCollector .on("collect", async interaction => {
                let server_data = databaseCollections.server_data;
                let guildDocument = await server_data.findOne({ server_id: interaction.guild.id });
                if (!interaction.isMessageComponent()) return;
                if (interaction.user.id !== interactionOwnerID) return;
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
                        settingsCollector.stop();
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
                            if(guildDocument?.settings===undefined){
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
                    if(interaction.customId === 'confession_review_select'){
                        let approvalChannelID = interaction.values;
                        //Check if nothing is selected
                        if(!approvalChannelID || approvalChannelID.length === 0){
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $unset: { 'settings.confession_review_channel_id': ' '} });
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }else{
                            let approvalChannelID = interaction.values.toString();
                            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { 'settings.confession_review_channel_id': approvalChannelID } });
                            const { flags, components } = await this.generateSettingsEmbed(interaction, db, databaseCollections, client, shardCollections);
                            await interaction.update({ flags: flags, components: components});
                        }
                    }

                }
            });
	},

};