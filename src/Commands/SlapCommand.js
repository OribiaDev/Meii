const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Gives a godly slap to a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to slap')
                  .setRequired(true)),
	async execute(interaction) {
        let SlapUser = interaction.options.getMember('user');
        if(SlapUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, ephemeral: true })
        if(SlapUser.id==interaction.member.id) return await interaction.reply({ content: `that’s kinda k-kinky..`, allowedMentions: { repliedUser: false }, ephemeral: true })
        let SlapUserID = SlapUser.id
        const Slapgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/slap`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            Slapgif.setTitle(`:raised_hand:  ${interaction.member.displayName} slapped ${interaction.guild.members.cache.get(SlapUserID).displayName}! :raised_hand:  `)
            Slapgif.setImage(String(image))
            Slapgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Slapgif.setTimestamp()
            await interaction.reply({ embeds: [Slapgif], allowedMentions: {repliedUser: true, users: [SlapUserID]}, content: `${interaction.guild.members.cache.get(SlapUserID)}`})
        });
	},
};