const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confession')
		.setDescription(`Moderation commands for the confession command`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Bans a user from confessions')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Select a user to ban from confessions')
                          .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('unban')
                .setDescription('Unbans a user from confessions')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Select a user to unban from confessions')
                          .setRequired(true))),
	async execute(interaction, pool, args, client, prefix) {
        //Confession Channel Setup Check
        var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
        pool.query(sql, async function (err, result) {
            if (err) throw err;
            let ConfessionChannelNotSet = new EmbedBuilder()
            .setTitle(`**Moderation Error: Confession Channel Not Set**`)
            .setColor("#ff6961")
            .setDescription(`Please setup the confession channel before using this commmand!`)
            .setFooter({text:`You can set it up by doing /set confession_channel`})  
            if(result[0]==undefined) return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})  
            if(result[0].confession_channel_ids=='null') return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})
            //Commands
            if (interaction.options.getSubcommand() === 'ban') {
                //Confession Ban Command
                var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`;
                pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    let confessbans = JSON.stringify(result[0].confession_userbans_ids);
                    let bUser = interaction.options.getMember('user');
                    if(bUser.id==client.user.id) return await interaction.reply({content:"\`You can't ban me silly~!\`", ephemeral: true })
                    if(confessbans.includes(bUser.id)) return await interaction.reply({ content:`\`This user is already banned from confessions on ${interaction.guild.name}.\``, ephemeral: true })
                    //Confess Ban User
                    var sql = `UPDATE server_data SET confession_userbans_ids = '${bUser.id + " " + result[0].confession_userbans_ids}' WHERE server_id = ${interaction.guild.id};`;
                    pool.query(sql, async function (err, result) {
                            if (err) throw err;
                            let ConfessBanned = new EmbedBuilder()
                            .setTitle(`**Confession: User Banned**`)
                            .setColor("#ff6961")
                            .setDescription(`${bUser} (${bUser.user.username}) has now been banned from using confessions on ${interaction.guild.name}.`)
                            .setFooter({text:`To unban this user please use ${prefix}confession unban`})
                            await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
                            return
                    });  
                });      
            } else if (interaction.options.getSubcommand() === 'unban'){
                //Confession Unban Command
                var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
                pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    let confessbans = result[0].confession_userbans_ids;
                    let bUser = interaction.options.getMember('user');
                    if(!confessbans.includes(bUser.id)) return await interaction.reply({content:`\`This user isnt banned from confessions on ${interaction.guild.name}.\``, ephemeral: true })
                    var finalconfessbanlist = confessbans.replace(new RegExp(bUser.id,'g'), "")
                    //Confess Unban User
                    var sql = `UPDATE server_data SET confession_userbans_ids = '${String(finalconfessbanlist)}' WHERE server_id = ${interaction.guild.id};`; 
                    pool.query(sql, async function (err, result) {
                        if (err) throw err;
                        let ConfessUnbanned = new EmbedBuilder()
                        .setTitle(`**Confession: User Unbanned**`)
                        .setColor("#ff6961")
                        .setDescription(`${bUser} (${bUser.user.username}) has now been unbanned from confessions on ${interaction.guild.name}.`)
                        .setFooter({text:`To ban this user again please use ${prefix}confession ban`})
                        await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
                        return
                    });  
                });  
            }
        })
	},
};