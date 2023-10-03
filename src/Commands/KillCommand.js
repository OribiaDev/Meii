const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kills said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kill')
                  .setRequired(true)),
	async execute(interaction) {     
        let KillUser = interaction.options.getMember('user');
        if(KillUser.id==interaction.member.id) return await interaction.reply({ content: `\`n-no- don't do that--\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let KillUserID = KillUser.id
        const Killgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/kill`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            Killgif.setTitle(`:knife: ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(image))
            Killgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Killgif.setTimestamp()
            await interaction.reply({ embeds: [Killgif], allowedMentions: {repliedUser: true, users: [KillUserID]}, content: `:knife: ${interaction.guild.members.cache.get(KillUserID)} :knife:`})
        });		
	},
};