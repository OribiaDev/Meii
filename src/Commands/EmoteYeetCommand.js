const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yeet')
		.setDescription('Yeets a user as far as it can')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to yeet')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let YeetUser = interaction.options.getMember('user');
        if(YeetUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(YeetUser.id==interaction.member.id) return await interaction.editReply({ content: `p-pls- n-no- ${interaction.member.displayName}`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let YeetUserID = YeetUser.id
        const yeetgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/yeet`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(image))
            yeetgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            yeetgif.setTimestamp()
            await interaction.editReply({ embeds: [yeetgif], allowedMentions: {repliedUser: true, users: [YeetUserID]}, content: `${interaction.guild.members.cache.get(YeetUserID)}`}) 
        });
	},
};