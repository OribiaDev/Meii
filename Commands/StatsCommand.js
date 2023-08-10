const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format")
const process = require('process')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Shows all of Meii's stats`),
	async execute(interaction, pool, args, client, prefix) {
		//Memory Math
		memoryUsageVar = process.memoryUsage()
		memoryUsed = memoryUsageVar.rss/1000000
		memoryUsedRoudned = Math.round(memoryUsed)
		//Command
		const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		let InfoEmb = new EmbedBuilder()
		.setColor("#C3B1E1")
		.setTitle("**Utility: Stats**")
		.setDescription(`Servers: **${client.guilds.cache.size}** \n Ping: \`${client.ws.ping}ms\` \n Memory Usage: \`${memoryUsedRoudned}MB\` \n Date Created: **3/8/2023** \n Last Updated: **8/09/2023** \n Author: **oribia.dev** \n Website: https://meiibot.xyz \n\n **Uptime**: \`${uptime}\` \n\n`)
		await interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
	},
};