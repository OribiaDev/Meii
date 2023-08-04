const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
require("moment-duration-format")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription(`Sends Meii's uptime`),
	async execute(interaction, pool, args, client, prefix) {
		const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		await interaction.reply({ content: `My Uptime: \`${uptime}\``, ephemeral: true });
	},
};
