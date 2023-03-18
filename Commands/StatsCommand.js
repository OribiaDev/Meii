const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Shows all of Meii's stats!`),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            let InfoEmb = new EmbedBuilder()
            .setColor("#C3B1E1")
            .setTitle(" **Stats:**")
            .setDescription(`Servers: **${client.guilds.cache.size}** \n Ping: **${client.ws.ping}ms** \n Date Created: **3/8/2023** \n Last Updated: **3/18/2023** \n Author: **ᴏʀɪʙɪᴀ#8440** \n Website: https://meiibot.xyz`)
            interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};