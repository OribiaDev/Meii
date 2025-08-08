const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Gives a godly slap to a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let SlapUser = interaction.options.getMember('user');
        if(SlapUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(SlapUser.id==interaction.member.id) return await interaction.editReply({ content: `that’s kinda k-kinky..`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let SlapUserID = SlapUser.id
        const Slapgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/slap`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(image))
            Slapgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Slapgif.setTimestamp()
            await interaction.editReply({ embeds: [Slapgif], allowedMentions: {repliedUser: true, users: [SlapUserID]}, content: `${interaction.guild.members.cache.get(SlapUserID)}`})
        });
	},
};