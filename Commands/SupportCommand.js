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
            .setDescription(`:sparkles:  [Click Me](https://discord.gg/J7QehvdDMq) to join the Support Server! :sparkles: `)
            await interaction.editReply({ embeds: [SupportEmb], allowedMentions: { repliedUser: false }})
            return
		}
	},
};