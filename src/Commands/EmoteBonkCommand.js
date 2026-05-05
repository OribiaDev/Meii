const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonks a user on the head')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bonk')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let BonkUser = interaction.options.getMember('user');
        if(BonkUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let BonkUserID = BonkUser.id
        const bonkgif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/bonk
            const res = await fetch("https://nekos.best/api/v2/bonk", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(image))
            bonkgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bonkgif.setTimestamp()
            await interaction.editReply({ embeds: [bonkgif], allowedMentions: {repliedUser: true, users: [BonkUserID]}, content:`${interaction.guild.members.cache.get(BonkUserID)}`})
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
