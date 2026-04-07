const { Events, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags  } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription(`Reports a confession to the moderation team of Meii`)
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
        const confessionDocument = await confession_data.findOne({ confession_id: confessionID });
        if(confessionDocument==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, flags: MessageFlags.Ephemeral  })
        //Confession Channel Lookup
        const botDocument = await bot_data.findOne({ type: 'prod' });
        const confession_report_channel_id = botDocument.report_channel_id;
        //Database
        let confession_text = confessionDocument.confession_text;
        let confession_id = confessionDocument.confession_id;
        let confession_attachment = confessionDocument.confession_attachment;
        let confession_date = confessionDocument.document_date;
        let confession_author = confessionDocument.author.username;
        let confession_author_id = confessionDocument.author.id;
        let guild_name = confessionDocument.guild.name;
        let guild_id = confessionDocument.guild.id;
        let report_author = interaction.member.user.username;
        let report_author_id = interaction.member.user.id;
        //Report Embed
        let reportEmbed = new EmbedBuilder()
        .setTitle(`Confession Report: ${confessionID}`)
        .setColor(`#ff6961`)
        .setDescription(`**Confession (${confession_id})**\n> ${confession_text}${confessionDocument.confession_attachment ? `\n\n**Attachment**\n${confession_attachment}\n\n` : '\n\n'}**Date**\n${confession_date}\n\n**Author**\n${confession_author} (${confession_author_id})\n\n**Guild**\n${guild_name} (${guild_id})\n\n**Report Author**\n${report_author} (${report_author_id})\n\n${confessionDocument.message.isReply ? `**Is Reply**\n${confessionDocument.message.isReply}\n\n` : ''}**Additional Info**\n${additionalInfo}`)
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
            return interaction.editReply({content:`Thank you, the confession with the ID of **${confession_id}** has now been reported to Meii's moderation team.`, flags: MessageFlags.Ephemeral  })
        });
	},
};