const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Bonks a user on the head')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to bonk')
                  .setRequired(true)),
	async execute(interaction) {
        let BonkUser = interaction.options.getMember('user');
        if(BonkUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, ephemeral: true })
        let BonkUserID = BonkUser.id
        const bonkgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/bonk`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            bonkgif.setTitle(`:hammer:  ${interaction.member.displayName} bonked ${interaction.guild.members.cache.get(BonkUserID).displayName}! :hammer:  `)
            bonkgif.setImage(String(image))
            bonkgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            bonkgif.setTimestamp()
            await interaction.reply({ embeds: [bonkgif], allowedMentions: {repliedUser: true, users: [BonkUserID]}, content:`:hammer: ${interaction.guild.members.cache.get(BonkUserID)} :hammer:`})
        });
	},
};