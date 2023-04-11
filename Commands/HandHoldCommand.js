const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handhold')
		.setDescription('Hold hands with said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hold hands with!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
            
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let HoldUser = interaction.options.getMember('user');
            if(HoldUser.id==interaction.member.id) return await interaction.editReply({ content: `\`Do you need some affection ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
            let HoldUserID = HoldUser.id
            const holdgif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/handhold').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            holdgif.setTitle(`:people_holding_hands:  ${interaction.member.displayName} held ${interaction.guild.members.cache.get(HoldUserID).displayName}'s hand! :people_holding_hands:  `)
            holdgif.setImage(String(FinalImage))
            holdgif.setFooter({text:`${currentDateAndTime}`})
            await interaction.editReply({ embeds: [holdgif], allowedMentions: {repliedUser: true, users: [HoldUserID]}, content: `:people_holding_hands: ${interaction.guild.members.cache.get(HoldUserID)} :people_holding_hands:`})
            })
            return
		}
	},
};