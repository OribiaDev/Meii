const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Tightly hugs a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hug')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let HugUser = interaction.options.getMember('user');
        if(HugUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(HugUser.id==interaction.member.id) return await interaction.editReply({ content: `Do you need a hug ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let HugUserID = HugUser.id
        const HugGif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/hug`)
        .then(async (res) => {
            if(!res.ok) return await interaction.editReply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            HugGif.setTitle(`:hugging:  ${interaction.member.displayName} hugged ${interaction.guild.members.cache.get(HugUserID).displayName}! :hugging: `)
            HugGif.setImage(String(image))
            HugGif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            HugGif.setTimestamp()
            await interaction.editReply({ embeds: [HugGif], allowedMentions: {repliedUser: true, users: [HugUserID]}, content: `${interaction.guild.members.cache.get(HugUserID)}`})
            
        });
	},
};