const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
var randomHexColor = require('random-hex-color')
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confesslogs')
		.setDescription('Set the channel for confession logging')
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('Select a channel for the confession logging')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        let confessionmodlogs = JSON.parse(fs.readFileSync("./Jsons/Confession/ConfessionModLog.json", "utf8"));
        if(!confessionmodlogs[interaction.guild.id]){
            confessionmodlogs[interaction.guild.id] = {
                confessionmodlogs: ""
            }
        }
		if(interaction.content==undefined){
			//Interaction
            if(!interaction.member.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return interaction.reply("You cannot use this command!")
            let channel = interaction.options.getChannel('channel');
            if(!channel) return interaction.reply({ content: 'Im sorry, I cannot find that channel!', allowedMentions: { repliedUser: true }})
            confessionmodlogs[interaction.guild.id] = {
                confessionmodlogs: channel.id
            };
            fs.writeFile("./Jsons/Confession/ConfessionModLog.json", JSON.stringify(confessionmodlogs), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new MessageEmbed()
            .setTitle(`**Confession Log Setup: Confession Log Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession log channel is now set too **${channel}!**`)
            .setFooter(`Confessions will now be logged!`)
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
            return
		}else{
			//Message
            if(!interaction.member.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return interaction.reply("You cannot use this command!")
            let channel = interaction.mentions.channels.first();
            if(!channel) return interaction.reply("Please try that again but mentioning the channel in the command!")
            confessionmodlogs[interaction.guild.id] = {
                confessionmodlogs: channel.id
            };
            fs.writeFile("./Jsons/Confession/ConfessionModLog.json", JSON.stringify(confessionmodlogs), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new MessageEmbed()
            .setTitle(`**Confession Log Setup: Confession Log Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession log channel is now set too **${channel}!**`)
            .setFooter(`Confessions will now be logged!`)
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
            return
		}
	},
};