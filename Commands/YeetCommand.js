const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yeet')
		.setDescription('Yeets said person')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to yeet!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let YeetUser = interaction.options.getMember('user');
            if(!YeetUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(YeetUser.user.bot) return interaction.reply({ content: "dont yeet the bots-", allowedMentions: { repliedUser: false }})
            if(YeetUser.id==interaction.member.id) return interaction.reply({ content: `n-no- ${interaction.member.displayName}`, allowedMentions: { repliedUser: false }})
            let YeetUserID = YeetUser.id
            const yeetgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/yeet').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(FinalImage))
            yeetgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [yeetgif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to yeet next time!", allowedMentions: { repliedUser: true }})
            let YeetUser = interaction.mentions.users.first()
            if(!YeetUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(YeetUser.bot) return interaction.reply({ content: "dont yeet the bots-", allowedMentions: { repliedUser: false }})
            if(YeetUser.id==interaction.author.id) return interaction.reply({ content: `n-no- ${interaction.member.displayName}`, allowedMentions: { repliedUser: false }})
            let YeetUserID = interaction.mentions.users.first().id
            const yeetgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/yeet').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(FinalImage))
            yeetgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [yeetgif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};