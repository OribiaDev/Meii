const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trap')
		.setDescription('Sends some trap nsfw'),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            const trapgif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/trap').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            trapgif.setTitle(`:underage: Heres some Trap for you ${interaction.member.displayName}! :underage: `)
            trapgif.setImage(String(FinalImage))
            trapgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [trapgif], allowedMentions: {repliedUser: false}})
        })
            return
		}else{
			//Message
            var currentDateAndTime = new Date().toLocaleString();
            if(!interaction.channel.nsfw) return interaction.reply({ content: "Sorry hun- this command can only run on channels that are marked as **NSFW**!", allowedMentions: { repliedUser: true }})
            const trapgif = new MessageEmbed()
            got('https://waifu.pics/api/nsfw/trap').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            trapgif.setTitle(`:underage: Heres some Trap for you ${interaction.member.displayName}! :underage: `)
            trapgif.setImage(String(FinalImage))
            trapgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [trapgif], allowedMentions: {repliedUser: false}})
        })
            return
		}
	},
};