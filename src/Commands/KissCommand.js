const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Kisses said user!')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kiss')
                  .setRequired(true)),
	async execute(interaction) {
        let KissUser = interaction.options.getMember('user');
        if(KissUser.id==interaction.member.id) return await interaction.reply({ content: `\`Do you need a kiss ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let KissUserID = KissUser.id
        const KissGif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/kiss`)
        .then(async (res) => {
            if(!res.ok) return await interaction.reply({ content:"\`I'm sorry, the API is currently offline. Please try again later.\`", ephemeral: true });
            const responseBody = await res.text();
            json = JSON.parse(responseBody);
            let image = json.url;
            KissGif.setTitle(`:sparkling_heart: ${interaction.member.displayName} kissed ${interaction.guild.members.cache.get(KissUserID).displayName}! :sparkling_heart: `)
            KissGif.setImage(String(image))
            KissGif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            KissGif.setTimestamp()
            await interaction.reply({ embeds: [KissGif], allowedMentions: {repliedUser: true, users: [KissUserID]}, content: `:sparkling_heart: ${interaction.guild.members.cache.get(KissUserID)} :sparkling_heart:`})     
        });	
	},
};