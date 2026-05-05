const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Gives a godly slap to a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let SlapUser = interaction.options.getMember('user');
        if(SlapUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(SlapUser.id==interaction.member.id) return await interaction.editReply({ content: `that’s kinda k-kinky..`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let SlapUserID = SlapUser.id
        const Slapgif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/slap
            const res = await fetch("https://nekos.best/api/v2/slap", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(image))
            Slapgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Slapgif.setTimestamp()
            await interaction.editReply({ embeds: [Slapgif], allowedMentions: {repliedUser: true, users: [SlapUserID]}, content: `${interaction.guild.members.cache.get(SlapUserID)}`})
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

