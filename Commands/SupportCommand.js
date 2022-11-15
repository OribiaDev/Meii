const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Sends the invite to the support server'),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            let SupportEmb = new EmbedBuilder()
            .setColor("#ffdac1")
            .setTitle("**Support Server:**")
            .setDescription(`:sparkles:  [https://discord.gg/J7QehvdDMq](https://discord.gg/J7QehvdDMq) :sparkles: `)
            interaction.reply({ embeds: [SupportEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};