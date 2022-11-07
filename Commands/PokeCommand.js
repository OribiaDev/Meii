const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('Pokes said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to poke!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let PokeUser = interaction.options.getMember('user');
            if(!PokeUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(PokeUser.user.bot) return interaction.reply({ content: "dont boke the bots- grr-", allowedMentions: { repliedUser: false }})
            if(PokeUser.id==interaction.member.id) return interaction.reply({ content: `i- dont poke yourself-`, allowedMentions: { repliedUser: false }})
            let PokeUserID = PokeUser.id
            const pokegif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/poke').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            pokegif.setTitle(`:point_right:   ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(FinalImage))
            pokegif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [pokegif], allowedMentions: {repliedUser: false}})
        })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to poke time!", allowedMentions: { repliedUser: true }})
            let PokeUser = interaction.mentions.users.first()
            if(!PokeUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(PokeUser.bot) return interaction.reply({ content: "dont boke the bots- grr-", allowedMentions: { repliedUser: false }})
            if(PokeUser.id==interaction.author.id) return interaction.reply({ content: `i- dont poke yourself-`, allowedMentions: { repliedUser: false }})
            let PokeUserID = interaction.mentions.users.first().id
            const pokegif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/poke').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            pokegif.setTitle(`:point_right:   ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(FinalImage))
            pokegif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [pokegif], allowedMentions: {repliedUser: false}})
        })
            return
		}
	},
};