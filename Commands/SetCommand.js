const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')

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
	async execute(interaction, pool, args, client, prefix) {
        //Sets Confession Channel
        if (interaction.options.getSubcommand() === 'confession_channel') {
            let channel = interaction.options.getChannel('channel');
            //Channel Permission Check
            if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages in that channel! \n I need \`Send Messages\`, \`Embed Links\`, and \`View Channel\``, ephemeral: true }).catch(() => {return;})
            var sql = `SELECT COUNT(*) FROM server_data WHERE server_id = ${interaction.guild.id}`;
            pool.query(sql, async function (err, result) {
                if (err) throw err;
                strresult = JSON.stringify(result[0]);
                if(strresult.includes(0)){
                    //Database Creation
                    var sql = `INSERT INTO server_data (server_id, confession_userbans_ids) VALUES (${interaction.guild.id}, ' ')`;
                    pool.query(sql, async function (err, result) {
                        if (err) throw err;
                        console.log(`New Database Entry Created with GuildID: ${interaction.guild.id}`);
                        //Set channel in newly created database
                        var sql = `UPDATE server_data SET confession_channel_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
                        pool.query(sql, async function (err, result) {
                            if (err) throw err;
                            let ChannelSet = new EmbedBuilder()
                            .setTitle(`**Confession Setup: Confession Channel Set**`)
                            .setColor("#77DD77")
                            .setDescription(`The confession channel is now set to **${channel}**`)
                            .setFooter({text:"DM the bot 'confess' to start using confessions!"})
                            await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                            return
                        });  
                    })
                }else{
                    //Existing Database
                    var sql = `UPDATE server_data SET confession_channel_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
                    pool.query(sql, async function (err, result) {
                        if (err) throw err;
                        let ChannelSet = new EmbedBuilder()
                        .setTitle(`**Confession Setup: Confession Channel Set**`)
                        .setColor("#77DD77")
                        .setDescription(`The confession channel is now set to **${channel}**`)
                        .setFooter({text:"DM the bot 'confess' to start using confessions!"})
                        await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                        return
                    });  
                }
            })    
        } else if (interaction.options.getSubcommand() === 'confession_log_channel'){
            //Database Confession Channel Check
            var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
            pool.query(sql, async function (err, result) {
                if (err) throw err;
                let ConfessionChannelNotSet = new EmbedBuilder()
                .setTitle(`**Confession Setup: Confession Channel Not Set**`)
                .setColor("#ff6961")
                .setDescription(`Please setup the confession channel before using this commmand!`)
                .setFooter({text:`You can set it up by doing /set confession_channel`})
                if(result[0]==undefined) return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})   
                if(result[0].confession_channel_ids=='null') return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}}) 
                //Sets Confession Logging Channel
                let channel = interaction.options.getChannel('channel');
                //Permission Check
                if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages in that channel! \n I need \`Send Messages\`, \`Embed Links\`, and \`View Channel\``, ephemeral: true }).catch(() => {return;})      
                //Confession Logging Set Channel
                var sql = `UPDATE server_data SET confession_modlog_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
                pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    let ChannelSet = new EmbedBuilder()
                    .setTitle(`**Confession Setup: Confession Log Channel Set**`)
                    .setColor("#77DD77")
                    .setDescription(`The confession log is now set too **${channel}**`)
                    .setFooter({text:`Confessions will now be logged!`})
                    await interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
                    return
                });  
            })
        }
	},
};