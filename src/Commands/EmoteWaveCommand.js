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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/wave
            const res = await fetch("https://nekos.best/api/v2/wave/", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            wavegif.setTitle(`:wave:  ${interaction.member.displayName} waved at ${interaction.guild.members.cache.get(WaveUserID).displayName}! :wave:   `)
            wavegif.setImage(String(image))
            wavegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            wavegif.setTimestamp()
            await interaction.editReply({ embeds: [wavegif], allowedMentions: {repliedUser: true, users: [WaveUserID]}, content: `${interaction.guild.members.cache.get(WaveUserID)}`}) 
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


