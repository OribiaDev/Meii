const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setconfesschannel')
		.setDescription('Sets the channel for confessions')
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('Select a channel for the confessions')
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
            //Confession Set Channel
            var sql = `UPDATE server_data SET confession_channel_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
            con.query(sql, function (err, result) {
                if (err) throw err;
                let ChannelSet = new EmbedBuilder()
                .setTitle(`**Confession Setup: Confession Channel Set**`)
                .setColor(randomHexColor())
                .setDescription(`The confession channel is now set to **${channel}!**`)
                .setFooter({text:"DM the bot 'confess' to start using confessions!"})
                interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                return
            });  
        }
	},
};