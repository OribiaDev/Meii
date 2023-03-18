const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setconfesslogs')
		.setDescription('Sets the channel for confession logging')
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('Select a channel for the confession logging')
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
		if(interaction.content==undefined){
			//Interaction
            if(!interaction.member.permissions.has(PermissionFlagsBits.ViewAuditLog)) return interaction.reply({ content: ':no_entry: You cannot use this command!', allowedMentions: { repliedUser: true }, ephemeral: true })
            let channel = interaction.options.getChannel('channel');
            if(!channel) return interaction.reply({ content: ':no_entry: Im sorry, I cannot find that channel!', allowedMentions: { repliedUser: true }, ephemeral: true })
            //Confession Mod Log Set Channel
            var sql = `UPDATE server_data SET confession_modlog_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
            con.query(sql, function (err, result) {
                if (err) throw err;
                let ChannelSet = new EmbedBuilder()
                .setTitle(`**Confession Log Setup: Confession Log Channel Set**`)
                .setColor(randomHexColor())
                .setDescription(`The confession log is now set too **${channel}!**`)
                .setFooter({text:`Confessions will now be logged!`})
                interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
                return
            });  
		}
	},
};