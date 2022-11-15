const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
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
            if(!interaction.member.permissions.has(PermissionFlagsBits.ViewAuditLog)) return interaction.reply("You cannot use this command!")
            let channel = interaction.options.getChannel('channel');
            if(!channel) return interaction.reply({ content: ':no_entry: Im sorry, I cannot find that channel!', allowedMentions: { repliedUser: true }, ephemeral: true })
            confessionmodlogs[interaction.guild.id] = {
                confessionmodlogs: channel.id
            };
            fs.writeFile("./Jsons/Confession/ConfessionModLog.json", JSON.stringify(confessionmodlogs), (err) => {
                if (err) console.log(err)
            });
            let ChannelSet = new EmbedBuilder()
            .setTitle(`**Confession Log Setup: Confession Log Channel Set**`)
            .setColor(randomHexColor())
            .setDescription(`The confession log channel is now set too **${channel}!**`)
            .setFooter({text:`Confessions will now be logged!`})
            interaction.reply({ embeds: [ChannelSet], allowedMentions: {repliedUser: false}})   
            return
		}
	},
};