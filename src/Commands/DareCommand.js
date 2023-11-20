const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dare')
		.setDescription('50/50 chance of doing a given dare')
        .addStringOption(option =>
            option
                .setName('dare')
                .setRequired(true)
                .setDescription('the given dare')),
	async execute(interaction) {
        const dareText = interaction.options.getString('dare');
        var ynBool = Math.random() < 0.5;
        let yk = ynBool ? "yes.":"no.";
        let dareEmb = new EmbedBuilder()
        .setColor(randomHexColor())
        .setTitle(`**Dare Calculator**`)
        .setDescription(`**Dare:**\n${dareText} \n\n**Does it have to be done?**\n${yk}`)
        .setFooter({text:`Requested by ${interaction.member.user.username}`})
        .setTimestamp()
        await interaction.reply({ embeds: [dareEmb], allowedMentions: { repliedUser: false }})
	},
};