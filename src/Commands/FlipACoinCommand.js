const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin'),
	async execute(interaction) {
        var headortail = Math.floor(Math.random() * 2) + 1;
        if(headortail==1){
            let answer = "heads"
            let CoinEmb = new EmbedBuilder()
            .setColor(randomHexColor())
            .setTitle(" **Coin Flip!**")
            .setDescription(`:coin:  You got.. **${answer}**!`)
            await interaction.reply({ embeds: [CoinEmb], allowedMentions: { repliedUser: false }})
        }
        if(headortail==2){
            let answer = "tails"
            let CoinEmb = new EmbedBuilder()
            .setColor(randomHexColor())
            .setTitle(" **Coin Flip!**")
            .setDescription(`:coin:  You got.. \`${answer}\`!`)
            await interaction.reply({ embeds: [CoinEmb], allowedMentions: { repliedUser: false }})
        }
	},
};