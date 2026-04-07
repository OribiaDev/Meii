const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const moment = require("moment");
require("moment-duration-format")
const process = require('process'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription(`Sends Meii's uptime`),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
		const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		await interaction.reply({ content: `My Uptime (Shard ${shardCollections.shardID}): \`${uptime}\``, flags: MessageFlags.Ephemeral  });
	},
};
