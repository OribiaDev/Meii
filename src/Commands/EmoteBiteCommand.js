const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bite')
		.setDescription('bites a person~')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bite')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let BiteUser = interaction.options.getMember('user');
        if(BiteUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let BiteUserID = BiteUser.id
        const bitegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/bite`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            bitegif.setTitle(`:woozy_face:  ${interaction.member.displayName} bit ${interaction.guild.members.cache.get(BiteUserID).displayName}! :woozy_face:  `)
            bitegif.setImage(String(image))
            bitegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bitegif.setTimestamp()
            await interaction.editReply({ embeds: [bitegif], allowedMentions: {repliedUser: true, users: [BiteUserID]}, content:`${interaction.guild.members.cache.get(BiteUserID)}`})
        });
	},
};