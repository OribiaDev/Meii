const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lick')
		.setDescription('Gives a user a giant lick')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to lick')
                  .setRequired(true)),
	async execute(interaction) {
        let LickUser = interaction.options.getMember('user');
        if(LickUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(LickUser.id==interaction.member.id) return await interaction.reply({ content: `_do that in private- not here_`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let LickUserID = LickUser.id
        const lickgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/lick`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            lickgif.setTitle(`:tongue:  ${interaction.member.displayName} licked ${interaction.guild.members.cache.get(LickUserID).displayName}! :tongue:   `)
            lickgif.setImage(String(image))
            lickgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            lickgif.setTimestamp()
            await interaction.reply({ embeds: [lickgif], allowedMentions: {repliedUser: true, users: [LickUserID]}, content: `${interaction.guild.members.cache.get(LickUserID)}`}) 
        });
	},
};