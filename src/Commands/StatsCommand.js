const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format")
const process = require('process')
let packageFile = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Shows all of Meii's stats`),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
		//Database Collection Vars
		let bot_data = databaseCollections.bot_data;
		//Updated Date
		let updatedDate = '8/05/2025'
		//Memory Math
		function getMemoryArray (){
			return client.shard.broadcastEval(async (c) => {
				let memusage = process.memoryUsage();
				let memused = memusage.rss/1000000
				let memusedrounded = Math.round(memused)
				return memusedrounded;
			}, {})
		}
		totalMemoryArray = await getMemoryArray();
		totalMemory = totalMemoryArray.reduce((acc, memCount) => acc + memCount, 0)
		let memString;
		if(totalMemory>1000){
			totalMemory = totalMemory/1000
			memString = `${totalMemory.toFixed(2)}GB`;
		}else{
			memString = `${totalMemory}MB`
		} 
		//Bot Data
		const botDocument = await bot_data.find({ type: 'prod' }).toArray();
		let confessionNumber = botDocument[0].confession_number;
		let updatedShardNumber = shardCollections.shardID;
		let guildNumber = await client.shard.fetchClientValues('guilds.cache.size');
		//Command
		const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		let InfoEmb = new EmbedBuilder()
		.setColor("#C3B1E1")
		.setTitle("**Utility: Stats**")
		.setDescription(`Servers: **${guildNumber.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}** \n Total Shards: **${shardCollections.totalShards}** ~ (Current Shard ID: **${updatedShardNumber}**) \n Total Confessions Sent: **${confessionNumber.toLocaleString()}** \n\n Ping: \`${client.ws.ping}ms\` \n Total Memory Usage: \`${memString}\` \n\n Last Updated: **${updatedDate}** \n Date Created: **3/08/2023** \n Version: **${packageFile.version}** \n\n Author: **oribia.dev** \n Website: https://meiibot.xyz \n\n **Uptime**: \`${uptime}\` \n\n`)
		await interaction.reply({ embeds: [InfoEmb], allowedMentions: { repliedUser: false }})
	},
};