const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Gives the ping of Meii!'),
	async execute(interaction, args, client) {
		await interaction.deferReply();
		//Permission Check
		if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)) return await interaction.editReply({ content: `I'm sorry, I do not have enough permissions for this command! \n I need \`Send Messages\`, and \`Read Message History\``, ephemeral: true }).catch(() => {return;})
		//Command
		const m = await interaction.channel.send("Ping?");
		await interaction.editReply(`:ping_pong: Pong! | Latency is \`${m.createdTimestamp - interaction.createdTimestamp}ms\` | API latency is \`${client.ws.ping}ms\``)
		m.delete()
	},
};