const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pat')
		.setDescription('Gives a user head pats')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to head pat')
                  .setRequired(true)),
	async execute(interaction) {
        let PatUser = interaction.options.getMember('user');
        if(PatUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let PatUserID = PatUser.id
        const patgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/pat`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            patgif.setTitle(`:palm_down_hand:  ${interaction.member.displayName} gave head pats to ${interaction.guild.members.cache.get(PatUserID).displayName}! :palm_down_hand:   `)
            patgif.setImage(String(image))
            patgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            patgif.setTimestamp()
            await interaction.reply({ embeds: [patgif], allowedMentions: {repliedUser: true, users: [PatUserID]}, content: `${interaction.guild.members.cache.get(PatUserID)}`}) 
        });
	},
};