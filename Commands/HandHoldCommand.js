const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handhold')
		.setDescription('Hold hands with said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hold hands with!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let HoldUser = interaction.options.getMember('user');
            if(!HoldUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(HoldUser.user.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(HoldUser.id==interaction.member.id) return interaction.reply({ content: `Do you need someone to hold your hands ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let HoldUserID = HoldUser.id
            const holdgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/handhold').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            holdgif.setTitle(`:people_holding_hands:  ${interaction.member.displayName} held ${interaction.guild.members.cache.get(HoldUserID).displayName}'s hand! :people_holding_hands:  `)
            holdgif.setImage(String(FinalImage))
            holdgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [holdgif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to hold hands with next time!", allowedMentions: { repliedUser: true }})
            let HoldUser = interaction.mentions.users.first()
            if(!HoldUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(HoldUser.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(HoldUser.id==interaction.author.id) return interaction.reply({ content: `Do you need someone to hold your hands ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let HoldUserID = interaction.mentions.users.first().id
            const holdgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/handhold').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            holdgif.setTitle(`:people_holding_hands:  ${interaction.member.displayName} held ${interaction.guild.members.cache.get(HoldUserID).displayName}'s hand! :people_holding_hands:  `)
            holdgif.setImage(String(FinalImage))
            holdgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [holdgif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};