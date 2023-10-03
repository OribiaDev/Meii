const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Sends the invite to the support server'),
	async execute(interaction) {
		let SupportEmb = new EmbedBuilder()
		.setColor("#ffdac1")
		.setTitle("**Utility: Support Server**")
		.setDescription(`:sparkles:  [Click Me](https://discord.gg/E23tPPTwSc) to join the Support Server! :sparkles: `)
		await interaction.reply({ embeds: [SupportEmb], allowedMentions: { repliedUser: false }, ephemeral: true })
	},
};