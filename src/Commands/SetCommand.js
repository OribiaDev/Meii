const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription(`Sets the channels for the confession module`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('confession_channel')
                .setDescription('Sets the channel for confessions')
                .addChannelOption(option => 
                    option.setName('channel')
                          .setDescription('Select a channel for the confessions')
                          .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('confession_log_channel')
                .setDescription('Sets the channel for confession logging')
                .addChannelOption(option => 
                    option.setName('channel')
                            .setDescription('Select a channel for the confession logging')
                            .setRequired(true))),
	async execute(interaction, db, databaseCollections, client) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        //Sets Confession Channel
        if (interaction.options.getSubcommand() === 'confession_channel') {
            let channel = interaction.options.getChannel('channel');
            //Channel Permission Check
            if(channel.isThread()){if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions in <#${channel.id}>.\nI need.. \`Send Messages\`, \`Embed Links\`, \`Send Messages in Threads\`, and \`View Channel\` `, ephemeral: true }).catch(() => {return;})}
            if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions in <#${channel.id}>.\nI need.. \`Send Messages\`, \`Embed Links\`, and \`View Channel\` `, ephemeral: true }).catch(() => {return;})
            const updateResult = await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_channel_id: `${channel.id}` } });
            if(updateResult.matchedCount==0){
                //Create New Document 
                await server_data.insertOne({ "server_id": `${interaction.guild.id}`, "confession_channel_id": `${channel.id}` });
                console.log(`New Database Document Created with GuildID: ${interaction.guild.id}`);
                let ChannelSet = new EmbedBuilder()
                .setTitle(`**Confession Setup: Confession Channel Set**`)
                .setColor("#77DD77")
                .setDescription(`Confessions will now be sent to **${channel}**`)
                .setFooter({text:"Use the command /confess to start using confessions!"})
                await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                return
            }else if (updateResult.matchedCount==1){
                //Update Document
                let ChannelSet = new EmbedBuilder()
                .setTitle(`**Confession Setup: Confession Channel Set**`)
                .setColor("#77DD77")
                .setDescription(`Confessions will now be sent to **${channel}**`)
                .setFooter({text:"Use the command /confess to start using confessions!"})
                await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                return
            }            
        } else if (interaction.options.getSubcommand() === 'confession_log_channel'){
            let channel = interaction.options.getChannel('channel');
            //Permission Check
            if(channel.isThread()){if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessagesInThreads)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions in <#${channel.id}>.\nI need.. \`Send Messages\`, \`Embed Links\`, \`Send Messages in Threads\`, and \`View Channel\` `, ephemeral: true }).catch(() => {return;})}
            if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions in <#${channel.id}>.\nI need.. \`Send Messages\`, \`Embed Links\`, and \`View Channel\` `, ephemeral: true }).catch(() => {return;})
            //Check if document exists
            const updateResult = await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_modlog_id: `${channel.id}` } });
            //Document Doesnt Exist
            let ConfessionChannelNotSet = new EmbedBuilder()
            .setTitle(`**Confession Setup: Confession Channel Not Set**`)
            .setColor("#ff6961")
            .setDescription(`Please setup the confession channel before using this commmand!`)
            .setFooter({text:`You can set it up by doing /set confession_channel`})
            if(updateResult.matchedCount==0) return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}}) 
            //Document Exists
            let ChannelSet = new EmbedBuilder()
            .setTitle(`**Confession Setup: Confession Log Channel Set**`)
            .setColor("#77DD77")
            .setDescription(`Confessions will now be logged in **${channel}**`)
            .setFooter({text:`Confessions will now be logged!`})
            await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
            return
        }
	},
};