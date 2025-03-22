const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Sends the invite to the support server'),
	async execute(interaction) {
		let SupportEmb = new EmbedBuilder()
		.setColor("#ffdac1")
		.setTitle("**Utility: Support Server**")
		.setDescription(`:sparkles:  [Click Me](https://meiibot.xyz/discord) to join the Support Server! :sparkles: `)
		await interaction.reply({ embeds: [SupportEmb], allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
	},
};