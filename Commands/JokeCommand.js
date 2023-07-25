const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Sends a joke'),
	async execute(interaction) {
		fetch('https://icanhazdadjoke.com/', {
			headers: {
				"Accept": "application/json",
				},
		})
		.then(res => res.json())
		.then(async json => {
			await interaction.reply({ content: `${json.joke}`, ephemeral: false });
			return
		});		
	},
};