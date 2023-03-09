const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kills said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kill!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let KillUser = interaction.options.getMember('user');
            if(!KillUser) return interaction.reply({ content: ":no_entry: Can't find that user!", allowedMentions: { repliedUser: true }, ephemeral: true });
            if(KillUser.user.bot) return interaction.reply({ content: ":no_entry: p-pls n-no-", allowedMentions: { repliedUser: false }, ephemeral: true })
            if(KillUser.id==interaction.member.id) return interaction.reply({ content: `:no_entry: n-no- don't do that--`, allowedMentions: { repliedUser: false }, ephemeral: true })
            let KillUserID = KillUser.id
            const Killgif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/kill').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Killgif.setTitle(`:knife:  ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(FinalImage))
            Killgif.setFooter({text:`${currentDateAndTime}`})
            interaction.reply({ embeds: [Killgif], allowedMentions: {repliedUser: true, users: [KillUserID]}, content: `:knife: ${interaction.guild.members.cache.get(KillUserID)} :knife:`})
            })
            return
		}
	},
};