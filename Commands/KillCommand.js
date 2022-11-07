const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kills said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kill!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let KillUser = interaction.options.getMember('user');
            if(!KillUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(KillUser.user.bot) return interaction.reply({ content: "n-no- ", allowedMentions: { repliedUser: false }})
            if(KillUser.id==interaction.member.id) return interaction.reply({ content: `n-no- dont do that--`, allowedMentions: { repliedUser: false }})
            let KillUserID = KillUser.id
            const Killgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/kill').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Killgif.setTitle(`:knife:  ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(FinalImage))
            Killgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Killgif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to kill next time!", allowedMentions: { repliedUser: true }})
            let KillUser = interaction.mentions.users.first()
            if(!KillUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(KillUser.bot) return interaction.reply({ content: "n-no- ", allowedMentions: { repliedUser: false }})
            if(KillUser.id==interaction.author.id) return interaction.reply({ content: `n-no- dont do that--`, allowedMentions: { repliedUser: false }})
            let KillUserID = interaction.mentions.users.first().id
            const Killgif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/kill').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Killgif.setTitle(`:knife:  ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(FinalImage))
            Killgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Killgif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};