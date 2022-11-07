const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('waifu')
		.setDescription('Sends some waifu nsfw'),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            const waifugif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/waifu').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            waifugif.setTitle(`:underage: Heres some Waifu for you ${interaction.member.displayName}! :underage: `)
            waifugif.setImage(String(FinalImage))
            waifugif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [waifugif], allowedMentions: {repliedUser: false}})
        })
            
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            const waifugif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/waifu').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            waifugif.setTitle(`:underage: Heres some Waifu for you ${interaction.member.displayName}! :underage: `)
            waifugif.setImage(String(FinalImage))
            waifugif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [waifugif], allowedMentions: {repliedUser: false}})
        })
            return
		}
	},
};