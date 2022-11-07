const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(`Shows all of Miku's info!`),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            let InfoEmb = new MessageEmbed()
            .setColor("#ffdac1")
            .setTitle(" **Info:**")
            .setDescription(`Prefix: **${prefix}** \n Servers: **${client.guilds.cache.size}** \n Ping: **${client.ws.ping}ms** \n Date Created: **10/16/2021** \n Last Updated: **10/16/2021** \n Author: **Thermionic#9046** `)
            interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}else{
			//Message
            let InfoEmb = new MessageEmbed()
            .setColor("#ffdac1")
            .setTitle(" **Info:**")
            .setDescription(`Prefix: **${prefix}** \n Servers: **${client.guilds.cache.size}** \n Ping: **${client.ws.ping}ms** \n Date Created: **10/16/2021** \n Last Updated: **10/16/2021** \n Author: **Thermionic#9046** `)
            interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};