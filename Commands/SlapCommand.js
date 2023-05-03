const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Slaps said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){    
			//Interaction
            let SlapUser = interaction.options.getMember('user');
            if(SlapUser.id==interaction.member.id) return await interaction.editReply({ content: `\`that’s kinda k-kinky..\``, allowedMentions: { repliedUser: false }, ephemeral: true })
            let SlapUserID = SlapUser.id
            const Slapgif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/slap').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(FinalImage))
            Slapgif.setFooter({text:`Requested by ${interaction.member.user.tag}`})
            Slapgif.setTimestamp()
            await interaction.editReply({ embeds: [Slapgif], allowedMentions: {repliedUser: true, users: [SlapUserID]}, content: `:raised_hand: ${interaction.guild.members.cache.get(SlapUserID)} :raised_hand:`})
            })
            return
		}
	},
};