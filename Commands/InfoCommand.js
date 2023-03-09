const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(`Shows all of Meii's info!`),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            let InfoEmb = new EmbedBuilder()
            .setColor("#ffdac1")
            .setTitle(" **Info:**")
            .setDescription(`Servers: **${client.guilds.cache.size}** \n Ping: **${client.ws.ping}ms** \n Date Created: **3/8/2023** \n Last Updated: **3/8/2023** \n Author: **ᴏʀɪʙɪᴀ#8440** `)
            interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};