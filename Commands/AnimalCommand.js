const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('animal')
		.setDescription('Sends a random animal image')
        .addStringOption(option =>
			option.setName('category')
				.setDescription('Type of animal')
				.setRequired(true)
				.addChoices(
					{ name: 'Bird', value: 'bird' },
					{ name: 'Cat', value: 'cat' },
					{ name: 'Dog', value: 'dog' },
					{ name: 'Fox', value: 'fox' },
					{ name: 'Kangaroo', value: 'kangaroo' },
					{ name: 'Koala', value: 'koala' },
					{ name: 'Panda', value: 'panda' },
					{ name: 'Raccoon', value: 'racoon' },
					{ name: 'Red Panda', value: 'red_panda' },
				)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
        const category = interaction.options.getString('category');
		fetch(`https://some-random-api.com/animal/${category}`)
		.then(res => res.json())
		.then(async json => {
			let animalemb = new EmbedBuilder()
				.setImage(json.image)
				.setFooter({text:`Requested by ${interaction.member.user.tag}`})
				.setTimestamp()
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});		
		}
	},
};