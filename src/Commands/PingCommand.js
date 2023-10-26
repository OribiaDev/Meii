const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Gives the ping of Meii!'),
	async execute(interaction, db, server_data, client) {
		await interaction.deferReply();
		//Command
		const m = await interaction.channel.send("Ping?");
		await interaction.editReply(`:ping_pong: Pong! | Latency is \`${m.createdTimestamp - interaction.createdTimestamp}ms\` | API latency is \`${client.ws.ping}ms\``)
		m.delete()
	},
};