const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong | Gives the ping of Meii'),
	async execute(interaction, db, databaseCollections, client) {
		if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to use this command. \nI need.. \`Send Messages\` `, ephemeral: true }).catch(() => {return; })
		await interaction.deferReply();
		const m = await interaction.channel.send("Ping?");
		await interaction.editReply(`:ping_pong: Pong! | Latency is \`${m.createdTimestamp - interaction.createdTimestamp}ms\` | API latency is \`${client.ws.ping}ms\``)
		m.delete()
	},
};