const { Events, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder  } = require('discord.js')

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
        await interaction.deferReply({ ephemeral: true });
        //Database Collection Vars
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        //Given Vars
        const confessionID = interaction.options.getString('confession_id').toUpperCase();
        let additionalInfo = interaction.options.getString('additional_info');
        //Confession Document
        const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, ephemeral: true })
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

        //Confession Delete Button
        const confessionDeleteButton = new ButtonBuilder()
        .setCustomId('confession-delete')
        .setLabel('Delete/Edit Confession')
        .setStyle(ButtonStyle.Primary);

        //Confession Ban Button
        const confessionBanButton = new ButtonBuilder()
        .setCustomId('confessions-ban')
        .setLabel('Confession Ban')
        .setStyle(ButtonStyle.Secondary);
        
        //Dismiss Button
        const confessionDismiss = new ButtonBuilder()
        .setCustomId('confessions-dismiss')
        .setLabel('Dismiss')
        .setStyle(ButtonStyle.Danger);

        //create button action row
        const buttonRow = new ActionRowBuilder().addComponents(confessionDeleteButton, confessionBanButton, confessionDismiss)
        let OrignalUserID = interaction.user.id;
        const interactionListener = async (interaction) => {
            if (!interaction.isMessageComponent()) return;
            if(interaction.message.interactionMetadata.user.id != OrignalUserID) return;
            if(interaction.isButton()){
                //Confession Delete Button
                if (interaction.customId === 'confession-delete') { 
                    try{
                        return client.shard.broadcastEval(async (c, { channelId, messageID }) => {
                            const channel = c.channels.cache.get(channelId);
                            if (channel) {
                                //Get Message
                                const confessionMessage = await channel.messages.fetch(messageID);
                                if(confessionMessage){
                                    //Editing Message
                                    const TOSMessage = "\n__**This confession has been removed for breaking Discord's And/or Meii's TOS.**__\n";
                                    await confessionMessage.edit({content: `${TOSMessage}`, embeds: []});
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }, { context: { channelId: confessionDocument[0].message.channel_id, messageID: confessionDocument[0].message.id } })
                            .then(sentArray => {
                                // Search for a non falsy value before providing feedback
                                if (!sentArray.includes(true)) {
                                    return interaction.reply({content:`I'm sorry, I couldnt edit/delete that confession.`, ephemeral: true })
                                }
                                return interaction.reply({content:`The confession with the ID of **${confession_id}** has been successfully edited/removed.`, ephemeral: false })
                            });
                    } catch (error) {
                        //Critical Error Catch
                        interaction.reply({content:`I'm sorry, there has been a error editing this confession.`, ephemeral: true })
                        return;
                    }

                }
                //Confession Ban Button
                if (interaction.customId === 'confessions-ban') {   
                    let confessionBansArray = botDocument[0].user_confession_bans || []
                    let index = confessionBansArray.indexOf(`${confession_author_id}`);
                    if (index !== -1) return await interaction.reply({ content:`This user is already banned from using confessions.`, ephemeral: true })
                    confessionBansArray.push(`${confession_author_id}`)  
                    await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                    return interaction.reply({content:`The user with the ID of \`${confession_author_id}\` is now banned from using confessions.`, ephemeral: false })
                }
                //Dismiss Button
                if (interaction.customId === 'confessions-dismiss') { 
                    client.removeListener(Events.InteractionCreate, interactionListener);
                    await interaction.update({ components: [] })
                }
            }
        };

        client.on(Events.InteractionCreate, interactionListener);

        return client.shard.broadcastEval(async (c, { channelId, reportEmbed, components }) => {
            const channel = c.channels.cache.get(channelId);
            if (channel) {
                await channel.send({ embeds: [reportEmbed], components: [components], allowedMentions: {repliedUser: false}})
                return true;
            }
            return false;
        }, { context: { channelId: confession_report_channel_id, reportEmbed: reportEmbed, components: buttonRow } })
        .then(sentArray => {
            // Search for a non falsy value before providing feedback
            if (!sentArray.includes(true)) {
                return interaction.editReply({content:`I'm sorry, there seems to have been a problem reporting that confession. Please try again later.`, ephemeral: true })
            }
            return interaction.editReply({content:`Thank you, the confession with the ID of **${confession_id}** has now been reported.`, ephemeral: true })
        });
	},
};