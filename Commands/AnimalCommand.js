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
					{ name: 'Bird', value: 'animal_bird' },
					{ name: 'Cat', value: 'animal_cat' },
					{ name: 'Dog', value: 'animal_dog' },
					{ name: 'Fox', value: 'animal_fox' },
					{ name: 'Kangaroo', value: 'animal_kangaroo' },
					{ name: 'Koala', value: 'animal_koala' },
					{ name: 'Panda', value: 'animal_panda' },
					{ name: 'Raccoon', value: 'animal_racoon' },
					{ name: 'Red Panda', value: 'animal_red_panda' },
				)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
        const category = interaction.options.getString('category');
		var currentDateAndTime = new Date().toLocaleString();
		//Bird
		if(category=='animal_bird'){			
			fetch('https://some-random-api.com/animal/bird')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});		
		}
		//Cat
		if(category=='animal_cat'){
			fetch('https://some-random-api.com/animal/cat')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Dog
		if(category=='animal_dog'){
			fetch('https://some-random-api.com/animal/dog')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Fox
		if(category=='animal_fox'){
			fetch('https://some-random-api.com/animal/fox')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Kangaroo
		if(category=='animal_kangaroo'){
			fetch('https://some-random-api.com/animal/kangaroo')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Kola
		if(category=='animal_koala'){
			fetch('https://some-random-api.com/animal/koala')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Panda
		if(category=='animal_panda'){
			fetch('https://some-random-api.com/animal/panda')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		//Raccoon
		if(category=='animal_racoon'){
			fetch('https://some-random-api.com/animal/racoon')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});		
		}
		//Red Panda
		if(category=='animal_red_panda'){
			fetch('https://some-random-api.com/animal/red_panda')
    		.then(res => res.json())
    		.then(async json => {
				let animalemb = new EmbedBuilder()
				 .setImage(json.image)
				 .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				 await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
    			});	
		}
		}
	},
};