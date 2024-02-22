const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Puts a user in the grave')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kill')
                  .setRequired(true)),
	async execute(interaction) {     
        let KillUser = interaction.options.getMember('user');
        if(KillUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, ephemeral: true })
        if(KillUser.id==interaction.member.id) return await interaction.reply({ content: `n-no- don't do that--`, allowedMentions: { repliedUser: false }, ephemeral: true })
        let KillUserID = KillUser.id
        const Killgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/kill`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            Killgif.setTitle(`:knife: ${interaction.member.displayName} killed ${interaction.guild.members.cache.get(KillUserID).displayName}! :knife:  `)
            Killgif.setImage(String(image))
            Killgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Killgif.setTimestamp()
            await interaction.reply({ embeds: [Killgif], allowedMentions: {repliedUser: true, users: [KillUserID]}, content: `:knife: ${interaction.guild.members.cache.get(KillUserID)} :knife:`}) 
        });	
	},
};