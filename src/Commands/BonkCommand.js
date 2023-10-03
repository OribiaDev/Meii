const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonks said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bonk')
                  .setRequired(true)),
	async execute(interaction) {
        let BonkUser = interaction.options.getMember('user');
        let BonkUserID = BonkUser.id
        const bonkgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/bonk`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(image))
            bonkgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bonkgif.setTimestamp()
            await interaction.reply({ embeds: [bonkgif], allowedMentions: {repliedUser: true, users: [BonkUserID]}, content:`:hammer: ${interaction.guild.members.cache.get(BonkUserID)} :hammer:`})
        });	
	},
};