const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bully')
		.setDescription('Bullys a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bully')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let BullyUser = interaction.options.getMember('user');
        if(BullyUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(BullyUser.id==interaction.member.id) return await interaction.editReply({ content: `i- do you need anger management-?`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let BullyUserID = BullyUser.id
        const bullygif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/bully`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            bullygif.setTitle(`:rage:  ${interaction.member.displayName} bullied ${interaction.guild.members.cache.get(BullyUserID).displayName}! :rage:   `)
            bullygif.setImage(String(image))
            bullygif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bullygif.setTimestamp()
            await interaction.editReply({ embeds: [bullygif], allowedMentions: {repliedUser: true, users: [BullyUserID]}, content: `${interaction.guild.members.cache.get(BullyUserID)}`}) 
        });
	},
};