const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shards')
		.setDescription(`Shows all of Meii's shards`),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
		//Bot Data
		let guildNumber = await client.shard.fetchClientValues('guilds.cache.size');
        let uptimeNumbers = await client.shard.fetchClientValues('uptime');
        //Memory 
		function getMemoryArray (){
			return client.shard.broadcastEval(async (c) => {
				let memusage = process.memoryUsage();
				let memused = memusage.rss/1000000
				let memusedrounded = Math.round(memused)
				return memusedrounded;
			}, {})
		}
		totalMemoryArray = await getMemoryArray();
        //Strings
        let shardString = '';
        let shardnumber = 0;
        for (let i = 0; i < shardCollections.totalShards; i++){
            if(i==shardCollections.shardID){
                shardnumber = `*__Shard ${i}__`
            }else{
                shardnumber = `__Shard ${i}__`;
            }
            let uptime = moment.duration(uptimeNumbers[i]).format(" D [days], H [hrs], m [mins], s [secs]");
            shardStringTemp = `${shardnumber}: \n ~ **${guildNumber[i]}** Servers \n ~ Memory Usage: \`${totalMemoryArray[i]}MB\` \n ~ Uptime: \`${uptime}\` \n\n`
            shardString = shardString.concat("", shardStringTemp);
        }
		//Command
		let ShardEmb = new EmbedBuilder()
		.setColor("#C3B1E1")
		.setTitle("**Utility: Shards**")
		.setDescription(`${shardString}`)
        .setFooter({text: "* is current shard"})
		await interaction.reply({ embeds: [ShardEmb], allowedMentions: { repliedUser: false }})
	},
};