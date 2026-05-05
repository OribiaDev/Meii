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
        await interaction.deferReply();
        let PatUser = interaction.options.getMember('user');
        if(PatUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let PatUserID = PatUser.id
        const patgif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/pat
            const res = await fetch("https://nekos.best/api/v2/pat", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            patgif.setTitle(`:palm_down_hand:  ${interaction.member.displayName} gave head pats to ${interaction.guild.members.cache.get(PatUserID).displayName}! :palm_down_hand:   `)
            patgif.setImage(String(image))
            patgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            patgif.setTimestamp()
            await interaction.editReply({ embeds: [patgif], allowedMentions: {repliedUser: true, users: [PatUserID]}, content: `${interaction.guild.members.cache.get(PatUserID)}`})     
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
