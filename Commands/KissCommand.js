const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Kisses said user!')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kiss!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let KissUser = interaction.options.getMember('user');
            if(!KissUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(KissUser.user.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(KissUser.id==interaction.member.id) return interaction.reply({ content: `Do you need a kiss ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let KissUserID = KissUser.id
            const KissGif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/kiss').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(FinalImage))
            KissGif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [KissGif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to kiss next time!", allowedMentions: { repliedUser: true }})
            let KissUser = interaction.mentions.users.first()
            if(!KissUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(KissUser.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(KissUser.id==interaction.author.id) return interaction.reply({ content: `Do you need a kiss ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let KissUserID = interaction.mentions.users.first().id
            const KissGif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/kiss').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(FinalImage))
            KissGif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [KissGif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};