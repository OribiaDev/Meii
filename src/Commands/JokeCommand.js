const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Sends a joke'),
	async execute(interaction) {
		await interaction.deferReply();
		fetch('https://icanhazdadjoke.com/', {
			headers: {
				"Accept": "application/json",
				},
		})
		.then(res => res.json())
		.then(async json => {
			await interaction.editReply({ content: `${json.joke}`, ephemeral: false });
			return
		});		
	},
};