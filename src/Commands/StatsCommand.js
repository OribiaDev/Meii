const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format")
const process = require('process')
let packageFile = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Shows all of Meii's stats`),
	async execute(interaction, db, databaseCollections, client) {
		//Database Collection Vars
		let bot_data = databaseCollections.bot_data;
		//Updated Date
		let updatedDate = '2/07/2024'
		//Memory Math
		memoryUsageVar = process.memoryUsage()
		memoryUsed = memoryUsageVar.rss/1000000
		memoryUsedRoudned = Math.round(memoryUsed)
		//Bot Data
		const botDocument = await bot_data.find({ type: 'prod' }).toArray();
		let confessionNumber = botDocument[0].confession_number;
		//Command
		const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		let InfoEmb = new EmbedBuilder()
		.setColor("#C3B1E1")
		.setTitle("**Utility: Stats**")
		.setDescription(`Servers: **${client.guilds.cache.size.toLocaleString()}** \n Total Confessions Sent: **${confessionNumber.toLocaleString()}** \n\n Ping: \`${client.ws.ping}ms\` \n Memory Usage: \`${memoryUsedRoudned}MB\` \n\n Last Updated: **${updatedDate}** \n Date Created: **3/08/2023** \n Version: **${packageFile.version}** \n\n Author: **oribia.dev** \n Website: https://meiibot.xyz \n\n **Uptime**: \`${uptime}\` \n\n`)
		await interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
	},
};