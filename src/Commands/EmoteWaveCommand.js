const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wave')
		.setDescription('Happily waves at a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to wave at')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let WaveUser = interaction.options.getMember('user');
        if(WaveUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let WaveUserID = WaveUser.id
        const wavegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/wave`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            wavegif.setTitle(`:wave:  ${interaction.member.displayName} waved at ${interaction.guild.members.cache.get(WaveUserID).displayName}! :wave:   `)
            wavegif.setImage(String(image))
            wavegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            wavegif.setTimestamp()
            await interaction.editReply({ embeds: [wavegif], allowedMentions: {repliedUser: true, users: [WaveUserID]}, content: `${interaction.guild.members.cache.get(WaveUserID)}`}) 
        });
	},
};