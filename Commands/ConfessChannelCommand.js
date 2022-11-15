const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
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
            if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply("You cannot use this command!")
            let channel = interaction.options.getChannel('channel');
            if(!channel) return interaction.reply({ content: ':no_entry: Im sorry, I cannot find that channel!', allowedMentions: { repliedUser: true }, ephemeral: true })
            confessionchannels[interaction.guild.id] = {
                confessionchannels: channel.id
            };
            fs.writeFile('./Jsons/Confession/ConfessionChannels.json', JSON.stringify(confessionchannels), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new EmbedBuilder()
            .setTitle(`**Confession Setup: Confession Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession channel is now set too **${channel}!**`)
            .setFooter({text:"You can now use confessions!"})
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})    
            return
		}
	},
};