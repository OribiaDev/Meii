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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/bite
            const res = await fetch("https://nekos.best/api/v2/bite", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            bitegif.setTitle(`:woozy_face:  ${interaction.member.displayName} bit ${interaction.guild.members.cache.get(BiteUserID).displayName}! :woozy_face:  `)
            bitegif.setImage(String(image))
            bitegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bitegif.setTimestamp()
            await interaction.editReply({ embeds: [bitegif], allowedMentions: {repliedUser: true, users: [BiteUserID]}, content:`${interaction.guild.members.cache.get(BiteUserID)}`})
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

