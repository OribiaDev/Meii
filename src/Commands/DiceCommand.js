const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Rolls a 6 Sided die'),
	async execute(interaction) {
        var num = Math.floor(Math.random() * 6) + 1;
        let DiceEmb = new EmbedBuilder()
        .setColor(randomHexColor())
        .setTitle(" **Dice Roll!**")
        .setDescription(`:game_die: You rolled a.. **${num}**!`)
        await interaction.reply({ embeds: [DiceEmb], allowedMentions: { repliedUser: false }})
	},
};