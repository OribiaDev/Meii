const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Hugs said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hug!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let HugUser = interaction.options.getMember('user');
            if(HugUser.user.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(HugUser.id==interaction.member.id) return interaction.reply({ content: `Do you need a hug ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let HugUserID = HugUser.id
            const HugGif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/hug').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            HugGif.setTitle(`:hugging:  ${interaction.member.displayName} hugged ${interaction.guild.members.cache.get(HugUserID).displayName}! :hugging: `)
            HugGif.setImage(String(FinalImage))
            HugGif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [HugGif], allowedMentions: {repliedUser: false}})
            })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!args[0]) return interaction.reply({ content: "Please mention a user to hug next time!", allowedMentions: { repliedUser: true }})
            let HugUser = interaction.mentions.users.first()
            if(!HugUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(HugUser.bot) return interaction.reply({ content: "..those damn botsexuals..", allowedMentions: { repliedUser: false }})
            if(HugUser.id==interaction.author.id) return interaction.reply({ content: `Do you need a hug ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }})
            let HugUserID = interaction.mentions.users.first().id
            const HugGif = new MessageEmbed()
            got('https://waifu.pics/api/sfw/hug').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            HugGif.setTitle(`:hugging:  ${interaction.member.displayName} hugged ${interaction.guild.members.cache.get(HugUserID).displayName}! :hugging: `)
            HugGif.setImage(String(FinalImage))
            HugGif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [HugGif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};