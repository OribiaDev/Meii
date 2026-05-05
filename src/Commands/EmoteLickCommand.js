const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lick')
		.setDescription('Gives a user a giant lick')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to lick')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let LickUser = interaction.options.getMember('user');
        if(LickUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(LickUser.id==interaction.member.id) return await interaction.editReply({ content: `_do that in private- not here_`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let LickUserID = LickUser.id
        const lickgif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //NO API CHANGE; NO VALID ALTERNATIVE
            const res = await fetch("https://api.waifu.pics/sfw/lick", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            //let image = json.results[0].url;
            let image = json.url;
            lickgif.setTitle(`:tongue:  ${interaction.member.displayName} licked ${interaction.guild.members.cache.get(LickUserID).displayName}! :tongue:   `)
            lickgif.setImage(String(image))
            lickgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            lickgif.setTimestamp()
            await interaction.editReply({ embeds: [lickgif], allowedMentions: {repliedUser: true, users: [LickUserID]}, content: `${interaction.guild.members.cache.get(LickUserID)}`}) 
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

