const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription(`Reports a confession`)
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession, found in the footer'))
        .addStringOption(option =>
            option
                .setName('additional_info')
                .setRequired(true)
                .setDescription('Additional information that would help with the report. (Context, evidence, etc.)')),
	async execute(interaction, db, databaseCollections, client) {
        await interaction.deferReply({ ephemeral: true });
        //Database Collection Vars
        let confession_data = databaseCollections.confession_data;
        //Given Vars
        const confessionID = interaction.options.getString('confession_id').toUpperCase();
        let additionalInfo = interaction.options.getString('additional_info');
        //Confession Document
        const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the bottom of the confession) is correct.`, ephemeral: true })
        //Confession Data Vars
        const confession_report_channel_id = '1183561309921493062';
        //Database
        let confession_text = confessionDocument[0].confession_text;
        let confession_id = confessionDocument[0].confession_id;
        let confession_date = confessionDocument[0].document_date;
        let confession_author = confessionDocument[0].author.username;
        let confession_author_id = confessionDocument[0].author.id;
        let guild_name = confessionDocument[0].guild.name;
        let guild_id = confessionDocument[0].guild.id;
        let report_author = interaction.member.user.username;
        let report_author_id = interaction.member.user.id;
        //Report Embed
        let reportEmbed = new EmbedBuilder()
        .setTitle(`Confession Report: ${confessionID}`)
        .setColor(`#ff6961`)
        .setDescription(`**Confession (${confession_id})**\n> ${confession_text}\n\n**Date**\n${confession_date}\n\n**Author**\n${confession_author} (${confession_author_id})\n\n**Guild**\n${guild_name} (${guild_id})\n\n**Report Author**\n${report_author} (${report_author_id})\n\n**Additional Info**\n${additionalInfo}`)
        .setTimestamp()
        client.channels.cache.get(confession_report_channel_id).send({ embeds: [reportEmbed], allowedMentions: {repliedUser: false}})
        return interaction.editReply({content:`Thank you, the confession with the ID of **${confession_id}** has now been reported.`, ephemeral: true })
	},
};