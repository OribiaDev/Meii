const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
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
            if(HugUser.id==interaction.member.id) return await interaction.editReply({ content: `\`Do you need a hug ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
            let HugUserID = HugUser.id
            const HugGif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/hug').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            HugGif.setTitle(`:hugging:  ${interaction.member.displayName} hugged ${interaction.guild.members.cache.get(HugUserID).displayName}! :hugging: `)
            HugGif.setImage(String(FinalImage))
            HugGif.setFooter({text:`${currentDateAndTime}`})
            await interaction.editReply({ embeds: [HugGif], allowedMentions: {repliedUser: true, users: [HugUserID]}, content: `:hugging: ${interaction.guild.members.cache.get(HugUserID)} :hugging:`})
            })
            return
		}
	},
};