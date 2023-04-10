const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Kisses said user!')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kiss!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
            await interaction.deferReply();
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let KissUser = interaction.options.getMember('user');
            if(KissUser.id==interaction.member.id) return await interaction.editReply({ content: `\`Do you need a kiss ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
            let KissUserID = KissUser.id
            const KissGif = new EmbedBuilder()
            got('https://api.waifu.pics/sfw/kiss').then(async response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(FinalImage))
            KissGif.setFooter({text:`${currentDateAndTime}`})
            await interaction.editReply({ embeds: [KissGif], allowedMentions: {repliedUser: true, users: [KissUserID]}, content: `:sparkling_heart: ${interaction.guild.members.cache.get(KissUserID)} :sparkling_heart:`})
            })
            return
		}
	},
};