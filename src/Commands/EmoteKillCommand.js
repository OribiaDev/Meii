const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Puts a user in the grave')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kill')
                  .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let KillUser = interaction.options.getMember('user');
        if(KillUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(KillUser.id==interaction.member.id) return await interaction.editReply({ content: `n-no- don't do that--`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        let KillUserID = KillUser.id
        const Killgif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/kill
            const res = await fetch("https://nekos.best/api/v2/shoot", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            Killgif.setTitle(`:knife: ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(image))
            Killgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Killgif.setTimestamp()
            await interaction.editReply({ embeds: [Killgif], allowedMentions: {repliedUser: true, users: [KillUserID]}, content: `${interaction.guild.members.cache.get(KillUserID)}`}) 
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



