const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
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
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let KissUser = interaction.options.getMember('user');
            if(!KissUser) return interaction.reply({ content: ":no_entry: Can't find that user!", allowedMentions: { repliedUser: true }, ephemeral: true });
            if(KissUser.user.bot) return interaction.reply({ content: ":no_entry: ..those damn botsexuals..", allowedMentions: { repliedUser: false }, ephemeral: true })
            if(KissUser.id==interaction.member.id) return interaction.reply({ content: `:no_entry: Do you need a kiss ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }, ephemeral: true })
            let KissUserID = KissUser.id
            const KissGif = new MessageEmbed()
            got('https://api.waifu.pics/sfw/kiss').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(FinalImage))
            KissGif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [KissGif], allowedMentions: {repliedUser: true, users: [KissUserID]}, content: `:sparkling_heart: ${interaction.guild.members.cache.get(KissUserID)} :sparkling_heart:`})
            })
            return
		}
	},
};