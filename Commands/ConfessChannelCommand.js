const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js')
var randomHexColor = require('random-hex-color')
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confesschannel')
		.setDescription('Set the channel for confessions')
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('Select a channel for the confessions')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        let confessionchannels = JSON.parse(fs.readFileSync('./Jsons/Confession/ConfessionChannels.json', "utf8"));
        if(!confessionchannels[interaction.guild.id]){
            confessionchannels[interaction.guild.id] = {
                confessionchannels: ""
            }
        }
		if(interaction.content==undefined){
			//Interaction
            if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply("You cannot use this command!")
            let channel = interaction.options.getChannel('channel');
            if(!channel) return interaction.reply({ content: 'Im sorry, I cannot find that channel!', allowedMentions: { repliedUser: true }})
            confessionchannels[interaction.guild.id] = {
                confessionchannels: channel.id
            };
            fs.writeFile('./Jsons/Confession/ConfessionChannels.json', JSON.stringify(confessionchannels), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new MessageEmbed()
            .setTitle(`**Confession Setup: Confession Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession channel is now set too **${channel}!**`)
            .setFooter("You can now use confessions!")
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
            return
		}else{
			//Message
            if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply("You cannot use this command!")
            let channel = interaction.mentions.channels.first();
            if(!channel) return interaction.reply({ content: 'Please try that again but mentioning the channel in the command!', allowedMentions: { repliedUser: true }})
            confessionchannels[interaction.guild.id] = {
                confessionchannels: channel.id
            };
            fs.writeFile('./Jsons/Confession/ConfessionChannels.json', JSON.stringify(confessionchannels), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new MessageEmbed()
            .setTitle(`**Confession Setup: Confession Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession channel is now set too **${channel}!**`)
            .setFooter("You can now use confessions!")
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
            return
		}
	},
};