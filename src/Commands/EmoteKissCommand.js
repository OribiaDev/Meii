const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Gives a user the warmest kiss')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kiss')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let KissUser = interaction.options.getMember('user');
        if(KissUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(KissUser.id==interaction.member.id) return await interaction.editReply({ content: `Do you need a kiss ${interaction.member.displayName}..?`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let KissUserID = KissUser.id
        const KissGif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/kiss
            const res = await fetch("https://nekos.best/api/v2/kiss", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(image))
            KissGif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            KissGif.setTimestamp()
            await interaction.editReply({ embeds: [KissGif], allowedMentions: {repliedUser: true, users: [KissUserID]}, content: `${interaction.guild.members.cache.get(KissUserID)}`})     
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

