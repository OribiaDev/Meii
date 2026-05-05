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
        await interaction.deferReply();
        let PokeUser = interaction.options.getMember('user');
        if(PokeUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(PokeUser.id==interaction.member.id) return await interaction.editReply({ content: `i- don't poke yourself-`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let PokeUserID = PokeUser.id
        const pokegif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/poke
            const res = await fetch("https://nekos.best/api/v2/poke", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            pokegif.setTitle(`:point_right:  ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(image))
            pokegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            pokegif.setTimestamp()
            await interaction.editReply({ embeds: [pokegif], allowedMentions: {repliedUser: true, users: [PokeUserID]}, content: `${interaction.guild.members.cache.get(PokeUserID)}`}) 
        } catch (err) {
            clearTimeout(timeout);
            console.error(err);
            await interaction.editReply({
                content: "I'm sorry, the API is currently offline (timeout or network error).",
                flags: MessageFlags.Ephemeral
            });
        }
	},
};
