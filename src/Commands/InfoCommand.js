const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')
const moment = require("moment");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(`Gives some info about a user/server`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('user').setDescription('User')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            //User
            const targetUser = interaction.options.getUser('user');
            if (targetUser) {
                //Target User Info
                let GuildMemberObject = interaction.guild.members.cache.get(targetUser.id)
                let notselfInfoEmbed = new EmbedBuilder()
                .setAuthor({ name: `User information for ${targetUser.username}`, iconURL: targetUser.displayAvatarURL()})
                .setColor(randomHexColor())
                .addFields(
                    { name: '**Username**', value: `${targetUser.username}`, inline: true },
                    { name: '**User ID**', value: `${targetUser.id}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Server Joined**', value: `${moment(GuildMemberObject.joinedAt)}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Discord Registerd**', value: `${moment(targetUser.createdAt)}`, inline: true },
                    { name: '\u200B', value: ' ' },
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setFooter({text:`Requested by ${interaction.member.user.username}`})
                .setTimestamp()
                await interaction.reply({ embeds: [notselfInfoEmbed], allowedMentions: { repliedUser: false }})                        
            } else {
                //Own Info
                let selfInfoEmbed = new EmbedBuilder()
                .setAuthor({ name: `User information for ${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL()})
                .setColor(randomHexColor())
                .addFields(
                    { name: '**Username**', value: `${interaction.member.user.username}`, inline: true },
                    { name: '**User ID**', value: `${interaction.member.user.id}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Server Joined**', value: `${moment(interaction.member.joinedAt)}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Discord Registerd**', value: `${moment(interaction.member.user.createdAt)}`, inline: true },
                    { name: '\u200B', value: ' ' },
                )
                .setThumbnail(interaction.member.displayAvatarURL())
                .setFooter({text:`Requested by ${interaction.member.user.username}`})
                .setTimestamp()
                await interaction.reply({ embeds: [selfInfoEmbed], allowedMentions: { repliedUser: false }})        
            }
        } else if (interaction.options.getSubcommand() === 'server') {
            //Server
            let serverOwner = await interaction.guild.fetchOwner()
            let serverInfoEmbed = new EmbedBuilder()
            .setTitle(`Server Information for ${interaction.guild.name}`)
            .setColor(randomHexColor())
            .addFields(
                { name: '**Server Name**', value: `${interaction.guild.name}`, inline: true },
                { name: '**Server ID**', value: `${interaction.guild.id}`, inline: true },
                { name: '\u200B', value: ' ' },
                { name: '**Date Created**', value: `${moment(interaction.guild.createdAt)}`, inline: true },
                { name: '\u200B', value: ' ' },
                { name: '**Owner**', value: `${serverOwner.user.username}`, inline: true },
                { name: '\u200B', value: ' ' },
                { name: '**Region**', value: `${interaction.guild.preferredLocale}`, inline: true },
            )
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text:`Requested by ${interaction.member.user.username}`})
            .setTimestamp()
            await interaction.reply({ embeds: [serverInfoEmbed], allowedMentions: { repliedUser: false }})       
        }
	},
};