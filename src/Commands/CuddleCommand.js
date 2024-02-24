const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription('Snuggles up with a user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to cuddle')
                  .setRequired(true)),
	async execute(interaction) {   
        let CuddleUser = interaction.options.getMember('user');
        if(CuddleUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, ephemeral: true })
        if(CuddleUser.id==interaction.member.id) return await interaction.reply({ content: `Do you need a cuddle ${interaction.member.displayName}..?`, ephemeral: true, allowedMentions: { repliedUser: false }})
        let CuddleUserID = CuddleUser.id
        const Cuddlegif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/cuddle`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            Cuddlegif.setTitle(`:people_hugging: ${interaction.member.displayName} cuddled ${interaction.guild.members.cache.get(CuddleUserID).displayName}! :people_hugging: `)
            Cuddlegif.setImage(String(image))
            Cuddlegif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            Cuddlegif.setTimestamp()
            await interaction.reply({ embeds: [Cuddlegif], allowedMentions: {repliedUser: true, users: [CuddleUserID]}, content:`${interaction.guild.members.cache.get(CuddleUserID)}`})
        });	
	},
};