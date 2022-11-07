const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Slaps said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let SlapUser = interaction.options.getMember('user');
            if(!SlapUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(SlapUser.user.bot) return interaction.reply({ content: "i- pls no-", allowedMentions: { repliedUser: false }})
            if(SlapUser.id==interaction.member.id) return interaction.reply({ content: `that’s kinda k-kinky..`, allowedMentions: { repliedUser: false }})
            let SlapUserID = SlapUser.id
            const Slapgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/slap').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(FinalImage))
            Slapgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Slapgif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to slap next time!", allowedMentions: { repliedUser: true }})
            let SlapUser = interaction.mentions.users.first()
            if(!SlapUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(SlapUser.bot) return interaction.reply({ content: "i- pls no-", allowedMentions: { repliedUser: false }})
            if(SlapUser.id==interaction.author.id) return interaction.reply({ content: `that’s kinda k-kinky..`, allowedMentions: { repliedUser: false }})
            let SlapUserID = interaction.mentions.users.first().id
            const Slapgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/slap').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(FinalImage))
            Slapgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Slapgif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};