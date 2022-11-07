const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription('Cuddles said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to cuddle!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let CuddleUser = interaction.options.getMember('user');
            if(!CuddleUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(CuddleUser.user.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(CuddleUser.id==interaction.member.id) return interaction.reply({ content: `Do you need a cuddle ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let CuddleUserID = CuddleUser.id
            const Cuddlegif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/cuddle').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(FinalImage))
            Cuddlegif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to cuddle next time!", allowedMentions: { repliedUser: true }})
            let CuddleUser = interaction.mentions.users.first()
            if(!CuddleUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(CuddleUser.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(CuddleUser.id==interaction.author.id) return interaction.reply({ content: `Do you need a cuddle ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let CuddleUserID = interaction.mentions.users.first().id
            const Cuddlegif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/cuddle').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(FinalImage))
            Cuddlegif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};