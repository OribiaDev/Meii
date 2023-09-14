const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription('Cuddles said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to cuddle')
                  .setRequired(true)),
	async execute(interaction) {   
        let CuddleUser = interaction.options.getMember('user');
        if(CuddleUser.id==interaction.member.id) return await interaction.reply({ content: `\`Do you need a cuddle ${interaction.member.displayName}..?\``, ephemeral: true, allowedMentions: { repliedUser: false }})
        let CuddleUserID = CuddleUser.id
        const Cuddlegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/cuddle`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(image))
            Cuddlegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Cuddlegif.setTimestamp()
            await interaction.reply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: true, users: [CuddleUserID]}, content:`:people_hugging: ${interaction.guild.members.cache.get(CuddleUserID)} :people_hugging:`})
        });	
	},
};