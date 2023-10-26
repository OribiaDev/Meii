const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yeet')
		.setDescription('Yeets said person')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to yeet')
                  .setRequired(true)),
	async execute(interaction) {
        let YeetUser = interaction.options.getMember('user');
        if(YeetUser.id==interaction.member.id) return await interaction.reply({ content: `p-pls- n-no- ${interaction.member.displayName}`, allowedMentions: { repliedUser: false }, ephemeral: true })
        let YeetUserID = YeetUser.id
        const yeetgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/yeet`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(image))
            yeetgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            yeetgif.setTimestamp()
            await interaction.reply({ embeds: [yeetgif], allowedMentions: {repliedUser: true, users: [YeetUserID]}, content: `:smiling_imp: ${interaction.guild.members.cache.get(YeetUserID)} :smiling_imp:`}) 
        });
	},
};