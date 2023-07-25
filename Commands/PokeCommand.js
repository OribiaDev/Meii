const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('Pokes said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to poke')
                  .setRequired(true)),
	async execute(interaction) {
        let PokeUser = interaction.options.getMember('user');
        if(PokeUser.id==interaction.member.id) return await interaction.reply({ content: `\`i- don't poke yourself-\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let PokeUserID = PokeUser.id
        const pokegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/poke`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            pokegif.setTitle(`:point_right:  ${interaction.member.displayName} poked ${interaction.guild.members.cache.get(PokeUserID).displayName}! :point_left:   `)
            pokegif.setImage(String(image))
            pokegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            pokegif.setTimestamp()
            await interaction.reply({ embeds: [pokegif], allowedMentions: {repliedUser: true, users: [PokeUserID]}, content: `:point_right: ${interaction.guild.members.cache.get(PokeUserID)} :point_left:`})
        });	
	},
};