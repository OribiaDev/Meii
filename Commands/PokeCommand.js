const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('Pokes said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to poke!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
            
			//Interaction
            let PokeUser = interaction.options.getMember('user');
            if(PokeUser.id==interaction.member.id) return await interaction.editReply({ content: `\`i- don't poke yourself-\``, allowedMentions: { repliedUser: false }, ephemeral: true })
            let PokeUserID = PokeUser.id
            const pokegif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/poke').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            pokegif.setTitle(`:point_right:   ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(FinalImage))
            pokegif.setFooter({text:`Requested by ${interaction.member.user.tag}`})
            pokegif.setTimestamp()
            await interaction.editReply({ embeds: [pokegif], allowedMentions: {repliedUser: true, users: [PokeUserID]}, content: `:point_right: ${interaction.guild.members.cache.get(PokeUserID)} :point_left:`})
        })
            return
		}
	},
};