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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/yeet
            const res = await fetch("https://nekos.best/api/v2/yeet", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(image))
            yeetgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            yeetgif.setTimestamp()
            await interaction.editReply({ embeds: [yeetgif], allowedMentions: {repliedUser: true, users: [YeetUserID]}, content: `${interaction.guild.members.cache.get(YeetUserID)}`}) 
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
