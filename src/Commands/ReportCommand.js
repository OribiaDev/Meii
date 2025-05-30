const { Events, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags  } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription(`Reports a confession`)
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession, found in the footer or title'))
        .addStringOption(option =>
            option
                .setName('additional_info')
                .setRequired(true)
                .setDescription('Additional information that would help with the report. (Context, evidence, etc.)')),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        //Database Collection Vars
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        //Given Vars
        const confessionID = interaction.options.getString('confession_id').toUpperCase();
        let additionalInfo = interaction.options.getString('additional_info');
        //Confession Document
        const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, flags: MessageFlags.Ephemeral  })
        //Confession Channel Lookup
        const botDocument = await bot_data.find({ type: 'prod' }).toArray();
        const confession_report_channel_id = botDocument[0].report_channel_id;
        //Database
        let confession_text = confessionDocument[0].confession_text;
        let confession_id = confessionDocument[0].confession_id;
        let confession_attachment = confessionDocument[0].confession_attachment;
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
        .setDescription(`**Confession (${confession_id})**\n> ${confession_text}${confessionDocument[0].confession_attachment ? `\n\n**Attachment**\n${confession_attachment}\n\n` : '\n\n'}**Date**\n${confession_date}\n\n**Author**\n${confession_author} (${confession_author_id})\n\n**Guild**\n${guild_name} (${guild_id})\n\n**Report Author**\n${report_author} (${report_author_id})\n\n${confessionDocument[0].message.isReply ? `**Is Reply**\n${confessionDocument[0].message.isReply}\n\n` : ''}**Additional Info**\n${additionalInfo}`)
        .setTimestamp()

        return client.shard.broadcastEval(async (c, { channelId, reportEmbed }) => {
            const channel = c.channels.cache.get(channelId);
            if (channel) {
                await channel.send({ embeds: [reportEmbed], allowedMentions: {repliedUser: false}})
                return true;
            }
            return false;
        }, { context: { channelId: confession_report_channel_id, reportEmbed: reportEmbed } })
        .then(sentArray => {
            // Search for a non falsy value before providing feedback
            if (!sentArray.includes(true)) {
                return interaction.editReply({content:`I'm sorry, there seems to have been a problem reporting that confession. Please try again later.`, flags: MessageFlags.Ephemeral  })
            }
            return interaction.editReply({content:`Thank you, the confession with the ID of **${confession_id}** has now been reported.`, flags: MessageFlags.Ephemeral  })
        });
	},
};