const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessban')
		.setDescription('Ban a user from confessions!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to ban from confessions!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        //Database Login
        var con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        //Database Block
        var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            let confessbans = JSON.stringify(result[0].confession_userbans_ids);
            if(interaction.content==undefined){
                //Interaction
                let bUser = interaction.options.getMember('user');
                if(!bUser) return interaction.reply({ content:"\`Can't find user! please mention the user in the command!\`", ephemeral: true });
                if(bUser.id=='1082401009206308945' || bUser.id=='1082402034759766016') return interaction.reply({content:"\`You can't ban me silly~!\`", ephemeral: true })
                if(confessbans.includes(bUser.id)) return interaction.reply({ content:"\`This user is already banned from confessions!\`", ephemeral: true })
                //Confess Ban User
                var sql = `UPDATE server_data SET confession_userbans_ids = '${bUser.id + " " + result[0].confession_userbans_ids}' WHERE server_id = ${interaction.guild.id};`;
                con.query(sql, function (err, result) {
                       if (err) throw err;
                       let ConfessBanned = new EmbedBuilder()
                       .setTitle(`**Confession: User Banned**`)
                       .setColor("#FF0000")
                       .setDescription(`${bUser} (${bUser.id}) has been banned from using confessions on ${interaction.guild.name}!`)
                       .setFooter({text:`To unban this user, do '${prefix}confessunban'`})
                       interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
                       return
           
                });  
            }

        });    
	},
};