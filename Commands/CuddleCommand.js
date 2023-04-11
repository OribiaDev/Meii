const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription('Cuddles said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to cuddle!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let CuddleUser = interaction.options.getMember('user');
            if(CuddleUser.id==interaction.member.id) return await interaction.editReply({ content: `\`Do you need a cuddle ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }})
            let CuddleUserID = CuddleUser.id
            const Cuddlegif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/cuddle').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(FinalImage))
            Cuddlegif.setFooter({text:`${currentDateAndTime}`})
            await interaction.editReply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: false}})
            })
            return
		}
	},
};