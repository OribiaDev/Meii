const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('Annoyingly pokes a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to poke')
                  .setRequired(true)),
	async execute(interaction) {
        let PokeUser = interaction.options.getMember('user');
        if(PokeUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(PokeUser.id==interaction.member.id) return await interaction.reply({ content: `i- don't poke yourself-`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let PokeUserID = PokeUser.id
        const pokegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/poke`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            pokegif.setTitle(`:point_right:  ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(image))
            pokegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            pokegif.setTimestamp()
            await interaction.reply({ embeds: [pokegif], allowedMentions: {repliedUser: true, users: [PokeUserID]}, content: `${interaction.guild.members.cache.get(PokeUserID)}`}) 
        });
	},
};