const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessunban')
		.setDescription('Unbans a user from confessions!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to unban from confessions!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        await interaction.deferReply();
        //Database Login
        var pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            connectionLimit: 100,
        });
        //Database Block
        var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
        pool.query(sql, async function (err, result) {
            if (err) throw err;
            let confessbans = result[0].confession_userbans_ids;
            if(interaction.content==undefined){
                //Interaction
                let bUser = interaction.options.getMember('user');
                if(!bUser) return await interaction.editReply({content:"\`Can't find user! please mention the user in the command!\`", ephemeral: true });
                if(!confessbans.includes(bUser.id)) return await interaction.editReply({content:"\`This user isnt banned from confessions!\`", ephemeral: true })
                var finalconfessbanlist = confessbans.replace(new RegExp(bUser.id,'g'), "")
                //Confess Unban User
                var sql = `UPDATE server_data SET confession_userbans_ids = '${String(finalconfessbanlist)}' WHERE server_id = ${interaction.guild.id};`; 
                pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    let ConfessUnbanned = new EmbedBuilder()
                    .setTitle(`**Confession User UnBanned**`)
                    .setColor("#00FF00")
                    .setDescription(`${bUser} (${bUser.id}) has now been unbanned from using confessions on ${interaction.guild.name}!`)
                    .setFooter({text:`To ban this user again, do '${prefix}confessban'`})
                    await interaction.editReply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
                    return
                });  
            }
        });  
	},
};