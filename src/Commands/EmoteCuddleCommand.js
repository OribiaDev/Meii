const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription('Snuggles up with a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to cuddle')
                  .setRequired(true)),
	async execute(interaction) {   
        await interaction.deferReply();
        let CuddleUser = interaction.options.getMember('user');
        if(CuddleUser==null) return await interaction.editReply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, flags: MessageFlags.Ephemeral  })
        if(CuddleUser.id==interaction.member.id) return await interaction.editReply({ content: `Do you need a cuddle ${interaction.member.displayName}..?`, flags: MessageFlags.Ephemeral , allowedMentions: { repliedUser: false }})
        let CuddleUserID = CuddleUser.id
        const Cuddlegif = new EmbedBuilder()
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds
        try {
            //https://api.waifu.pics/sfw/cuddle
            const res = await fetch("https://nekos.best/api/v2/cuddle", {signal: controller.signal});
            clearTimeout(timeout);
            if (!res.ok) {
                return await interaction.editReply({
                    content: "I'm sorry, the API is currently offline.",
                    flags: MessageFlags.Ephemeral
                });
            }
            const json = await res.json();
            let image = json.results[0].url;
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(image))
            Cuddlegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Cuddlegif.setTimestamp()
            await interaction.editReply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: true, users: [CuddleUserID]}, content:`${interaction.guild.members.cache.get(CuddleUserID)}`})
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

