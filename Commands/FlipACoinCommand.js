const { SlashCommandBuilder } = require('@discordjs/builders');
const randomHexColor = require('random-hex-color')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin'),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var headortail = Math.floor(Math.random() * 2) + 1;
            if(headortail==1){
                let answer = "heads"
                let CoinEmb = new EmbedBuilder()
                .setColor(randomHexColor())
                .setTitle(" **Coin Flip!**")
                .setDescription(`:coin:  You got.. **${answer}**!`)
                await interaction.editReply({ embeds: [CoinEmb], allowedMentions: { repliedUser: false }})
                return
            }
            if(headortail==2){
                let answer = "tails"
                let CoinEmb = new EmbedBuilder()
                .setColor(randomHexColor())
                .setTitle(" **Coin Flip!**")
                .setDescription(`:coin:  You got.. \`${answer}\`!`)
                await interaction.editReply({ embeds: [CoinEmb], allowedMentions: { repliedUser: false }})
                return
            }
		}
	},
};