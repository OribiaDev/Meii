const { SlashCommandBuilder } = require('@discordjs/builders');
const randomHexColor = require('random-hex-color')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Rolls a 6 Sided die'),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var num = Math.floor(Math.random() * 6) + 1;
            let DiceEmb = new EmbedBuilder()
            .setColor(randomHexColor())
            .setTitle(" **Dice Roll!**")
            .setDescription(`:game_die: You rolled a.. **${num}**!`)
            await interaction.editReply({ embeds: [DiceEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};