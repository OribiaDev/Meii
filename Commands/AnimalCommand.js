const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { api } = require('some-random-api');
 
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
		//Using Web API
		if(category=='animal_bird'){
			await interaction.deferReply();
			fetch('https://some-random-api.ml/animal/bird')
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
			await interaction.deferReply();
			api.img.cat().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});	
		}
		//Dog
		if(category=='animal_dog'){
			await interaction.deferReply();
			api.img.dog().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});	
		}
		//Fox
		if(category=='animal_fox'){
			await interaction.deferReply();
			api.img.fox().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});	
		}
		//Kangaroo
		//Using Web API
		if(category=='animal_kangaroo'){
			await interaction.deferReply();
			fetch('https://some-random-api.ml/animal/kangaroo')
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
			await interaction.deferReply();
			api.img.koala().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});	
		}
		//Panda
		if(category=='animal_panda'){
			await interaction.deferReply();
			api.img.panda().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});		
		}
		//Raccoon
		//Using Web API 
		if(category=='animal_racoon'){
			await interaction.deferReply();
			fetch('https://some-random-api.ml/animal/raccoon')
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
			await interaction.deferReply();
			api.img.redpanda().then(async res => {
				let content = res.link;
				let ContentFilter1 = content.replace(/{ link: '/gi, "")
				let FinalImage = ContentFilter1.replace(/' }/gi, "")
				let animalemb = new EmbedBuilder()
				.setImage(FinalImage)
				.setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
				await interaction.editReply({ embeds: [animalemb], allowedMentions: { repliedUser: false }});
			});	
		}
		}
	},
};