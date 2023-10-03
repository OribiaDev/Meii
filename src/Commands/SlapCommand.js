const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Slaps said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap')
                  .setRequired(true)),
	async execute(interaction) {
        let SlapUser = interaction.options.getMember('user');
        if(SlapUser.id==interaction.member.id) return await interaction.reply({ content: `\`that’s kinda k-kinky..\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let SlapUserID = SlapUser.id
        const Slapgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/slap`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(image))
            Slapgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Slapgif.setTimestamp()
            await interaction.reply({ embeds: [Slapgif], allowedMentions: {repliedUser: true, users: [SlapUserID]}, content: `:raised_hand: ${interaction.guild.members.cache.get(SlapUserID)} :raised_hand:`})
        });	
	},
};