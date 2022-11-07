const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blow')
		.setDescription('Gives said user a blowjob')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to blow!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            let BlowUser = interaction.options.getMember('user');
            if(!BlowUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(BlowUser.user.bot) return interaction.reply({ content: "..damn botsexuals...", allowedMentions: { repliedUser: false }})
            if(BlowUser.id==interaction.member.id) return interaction.reply({ content: `i- thats hard too do-`, allowedMentions: { repliedUser: false }})
            let BlowUserID = BlowUser.id
            const Blowgif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/blowjob').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Blowgif.setTitle(`:underage: ${interaction.member.displayName} gave ${interaction.guild.members.cache.get(BlowUserID).displayName} a blowjob! :underage: `)
            Blowgif.setImage(String(FinalImage))
            Blowgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Blowgif], allowedMentions: {repliedUser: false}})
        })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            if(!args[0]) return interaction.reply({ content: "Please mention a user to blow time!", allowedMentions: { repliedUser: true }})
            let BlowUser = interaction.mentions.users.first()
            if(!BlowUser) return interaction.reply({ content: "Cant find that user!", allowedMentions: { repliedUser: true }});
            if(BlowUser.bot) return interaction.reply({ content: "..damn botsexuals...", allowedMentions: { repliedUser: false }})
            if(BlowUser.id==interaction.author.id) return interaction.reply({ content: `i- thats hard too do-`, allowedMentions: { repliedUser: false }})
            let BlowUserID = interaction.mentions.users.first().id
            const Blowgif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/blowjob').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Blowgif.setTitle(`:underage: ${interaction.member.displayName} gave ${interaction.guild.members.cache.get(BlowUserID).displayName} a blowjob! :underage: `)
            Blowgif.setImage(String(FinalImage))
            Blowgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [Blowgif], allowedMentions: {repliedUser: false}})
        })
            return
		}
	},
};