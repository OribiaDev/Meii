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
		.then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
			await interaction.editReply({ content: `${json.joke}`, ephemeral: false });
			return      
        });
	},
};