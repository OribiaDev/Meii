const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonks said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bonk!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let BonkUser = interaction.options.getMember('user');
            if(!BonkUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(BonkUser.user.bot) return interaction.reply({ content: "dont bonk the bots-", allowedMentions: { repliedUser: false }})
            let BonkUserID = BonkUser.id
            const bonkgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/bonk').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(FinalImage))
            bonkgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [bonkgif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to bonk next time!", allowedMentions: { repliedUser: true }})
            let BonkUser = interaction.mentions.users.first()
            if(!BonkUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(BonkUser.bot) return interaction.reply({ content: "dont bonk the bots-", allowedMentions: { repliedUser: false }})
            let BonkUserID = interaction.mentions.users.first().id
            const bonkgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/bonk').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(FinalImage))
            bonkgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [bonkgif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};