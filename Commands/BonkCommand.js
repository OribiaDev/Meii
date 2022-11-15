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
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let BonkUser = interaction.options.getMember('user');
            if(!BonkUser) return interaction.reply({ content: ":no_entry: Can't find that user!", allowedMentions: { repliedUser: true }, ephemeral: true });
            if(BonkUser.user.bot) return interaction.reply({ content: ":no_entry: please don't bonk the bots-", allowedMentions: { repliedUser: false }, ephemeral: true })
            let BonkUserID = BonkUser.id
            const bonkgif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/bonk').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(FinalImage))
            bonkgif.setFooter({text:`${currentDateAndTime}`})
            interaction.reply({ embeds: [bonkgif], allowedMentions: {repliedUser: true, users: [BonkUserID]}, content:`:hammer: ${interaction.guild.members.cache.get(BonkUserID)} :hammer:`})
            })
            return
		}
	},
};