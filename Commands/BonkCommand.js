const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonks said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bonk!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
            await interaction.deferReply();
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let BonkUser = interaction.options.getMember('user');
            let BonkUserID = BonkUser.id
            const bonkgif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/bonk').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(FinalImage))
            bonkgif.setFooter({text:`${currentDateAndTime}`})
            await interaction.editReply({ embeds: [bonkgif], allowedMentions: {repliedUser: true, users: [BonkUserID]}, content:`:hammer: ${interaction.guild.members.cache.get(BonkUserID)} :hammer:`})
            })
            return
		}
	},
};