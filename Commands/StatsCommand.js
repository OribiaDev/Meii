const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Shows all of Meii's stats!`),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			
			//Interaction
			const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            let InfoEmb = new EmbedBuilder()
            .setColor("#C3B1E1")
            .setTitle(" **Stats:**")
            .setDescription(`Servers: **${client.guilds.cache.size}** \n Ping: \`${client.ws.ping}ms\` \n Date Created: **3/8/2023** \n Last Updated: **5/1/2023** \n Author: **ᴏʀɪʙɪᴀ#8440** \n Website: https://meiibot.xyz \n\n **Uptime**: \`${uptime}\``)
            await interaction.editReply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};