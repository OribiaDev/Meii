const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setconfesschannel')
		.setDescription('Sets the channel for confessions')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('Select a channel for the confessions')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        if(interaction.content==undefined){
            //Interaction
            let channel = interaction.options.getChannel('channel');
            //Channel Permission Check
            if(!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                return await interaction.editReply({ content: `I'm sorry, I do not have enough permissions to send messages in that channel! \n I need \`Send Messages\`, \`Embed Links\`, and \`View Channel\``, ephemeral: true }).catch(() => {
                    return;
                })
            }
            
            //Database Login
            var con = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            //Confession Set Channel
            var sql = `UPDATE server_data SET confession_channel_ids = '${channel.id}' WHERE server_id = ${interaction.guild.id};`; 
            con.query(sql, async function (err, result) {
                if (err) throw err;
                let ChannelSet = new EmbedBuilder()
                .setTitle(`**Confession Setup: Confession Channel Set**`)
                .setColor(randomHexColor())
                .setDescription(`The confession channel is now set to **${channel}!**`)
                .setFooter({text:"DM the bot 'confess' to start using confessions!"})
                await interaction.editReply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
                return
            });  
        }
	},
};