const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Hugs said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hug')
                  .setRequired(true)),
	async execute(interaction) {
        let HugUser = interaction.options.getMember('user');
        if(HugUser.id==interaction.member.id) return await interaction.reply({ content: `\`Do you need a hug ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let HugUserID = HugUser.id
        const HugGif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/hug`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            HugGif.setTitle(`:hugging:  ${interaction.member.displayName} hugged ${interaction.guild.members.cache.get(HugUserID).displayName}! :hugging: `)
            HugGif.setImage(String(image))
            HugGif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            HugGif.setTimestamp()
            await interaction.reply({ embeds: [HugGif], allowedMentions: {repliedUser: true, users: [HugUserID]}, content: `:hugging: ${interaction.guild.members.cache.get(HugUserID)} :hugging:`})
        });	
	},
};