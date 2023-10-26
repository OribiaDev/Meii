const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('Submit an anonymous confession')
        .addStringOption(option =>
            option
                .setName('message')
                .setRequired(true)
                .setDescription('The message you want to confess')),
	async execute(interaction, db, server_data, client, prefix) {
        await interaction.deferReply({ ephemeral: true });
        //Guild Document
        const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
        //Database Document Check
        let ConfessionNotSet = new EmbedBuilder()
        .setTitle(`**Confession Channel Not Set**`)
        .setColor('#ff6961')
        .setDescription(`I'm sorry, the confession channel is not setup for **${interaction.guild.name}**.`)
        .setFooter({text:`Ask a staff member to set it up with ${prefix}set confession_channel`})
        //No Confess Channel
        if(guildDocument[0]==undefined) return await interaction.editReply({ embeds: [ConfessionNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})   
        //Check if user is banned from confessions
        let ConfessionIsBanned = new EmbedBuilder()
        .setTitle(`**${interaction.guild.name}: Confession Banned**`)
        .setColor("#ff6961")
        .setDescription(`I'm sorry, you're banned from using confessions in **${interaction.guild.name}**.`)
        .setFooter({text:`If you think this is a mistake, please contact a staff member.`})
        const userbans = guildDocument[0].confession_userbans_id || [] //returns empty array if userbans is not present
        let index = userbans.indexOf(`${interaction.member.user.id}`);
        if (index !== -1) return await interaction.editReply({ embeds: [ConfessionIsBanned], ephemeral: true, allowedMentions: {repliedUser: false}})
        //Confession Channel Error
        let channelNotFound = new EmbedBuilder()
        .setTitle(`**${interaction.guild.name}: Confession Channel Error**`)
        .setColor('#ff6961')
        .setDescription(`I'm sorry, i'm having trouble finding the confession channel in **${interaction.guild.name}**.`)
        .setFooter({text:`Tell a staff member to re-set the confession channel!`})
        if(!client.channels.cache.get(guildDocument[0].confession_channel_id)) return await interaction.editReply({ embeds: [channelNotFound], ephemeral: true})
        //Sending the Confession
        let confessionchannel = interaction.guild.channels.cache.get(guildDocument[0].confession_channel_id)
        let confessedmessage = interaction.options.getString('message');
        let Confession = new EmbedBuilder()
        .setTitle(`**:love_letter: Anonymous Confession**`)
        .setColor(randomHexColor())
        .setDescription(`> ${confessedmessage}`)
        .setTimestamp()
        try{
            if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.editReply({ content: `Im sorry, I dont have enough permissions to send messages in the set confession channel!\nI need \`Send Messages\`, \`Embed Links\`, and \`View Channel\``, ephemeral: true })
            confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}})
   
        }catch( error ){
            return await interaction.editReply({content: `I'm sorry, there has been an error. Please try again.`, ephemeral: true })
        }
        await interaction.editReply({ content: `Your confession has now been added to **${confessionchannel}**  :thumbsup: `, ephemeral: true });
        //Check if server has Confession Logging 
        if(guildDocument[0].confession_modlog_id==undefined) return
        if(!client.channels.cache.get(guildDocument[0].confession_modlog_id)) return
        //Getting the channel
        let confessionmodchannel = client.channels.cache.get(guildDocument[0].confession_modlog_id)
        //Permissions Check
        if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return                 
        //Sending the Confession Log
        let ConfessionLog = new EmbedBuilder()
        .setTitle(`:love_letter: **Anonymous Confession**`)
        .setColor(randomHexColor())
        .setDescription(`"${confessedmessage}" \n\n **User**  \n ||${interaction.member.user.username}  (${interaction.member})||`)
        .setTimestamp()
        confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
	},
};