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
            .setDescription(`Servers: **${client.guilds.cache.size}** \n Ping: **${client.ws.ping}ms** \n Date Created: **11/14/2022** \n Last Updated: **11/14/2022** \n Author: **ɴᴇɪᴛᴏ#8770** `)
            interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};