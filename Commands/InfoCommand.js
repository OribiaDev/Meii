const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')
const moment = require("moment");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(`Sends some info about a user or a server!`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('user').setDescription('User')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
            
            var currentDateAndTime = new Date().toLocaleString();
			//Interaction
            if (interaction.options.getSubcommand() === 'user') {
                //User
                const taruser = interaction.options.getUser('user');
                if (taruser) {
                    //Target User Info
                    let notowninfoemb = new EmbedBuilder()
                    .setAuthor({ name: `User information for ${taruser.tag}`, iconURL: taruser.displayAvatarURL()})
                    .setColor(randomHexColor())
                    .addFields(
                        { name: '**User Tag**', value: `${taruser.tag}`, inline: true },
                        { name: '**User ID**', value: `${taruser.id}`, inline: true },
                        { name: '\u200B', value: ' ' },
                        { name: '**Server Joined**', value: `${moment(taruser.joinedAt)}`, inline: true },
                        { name: '\u200B', value: ' ' },
                        { name: '**Discord Registerd**', value: `${moment(taruser.createdAt)}`, inline: true },
                        { name: '\u200B', value: ' ' },
                    )
                    .setThumbnail(taruser.displayAvatarURL())
                    .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
                    await interaction.editReply({ embeds: [notowninfoemb], allowedMentions: { repliedUser: false }})                        
                } else {
                    //Own Info
                    let owninfoemb = new EmbedBuilder()
                    .setAuthor({ name: `User information for ${interaction.member.user.tag}`, iconURL: interaction.member.displayAvatarURL()})
                    .setColor(randomHexColor())
                    .addFields(
                        { name: '**User Tag**', value: `${interaction.member.user.tag}`, inline: true },
                        { name: '**User ID**', value: `${interaction.member.user.id}`, inline: true },
                        { name: '\u200B', value: ' ' },
                        { name: '**Server Joined**', value: `${moment(interaction.member.joinedAt)}`, inline: true },
                        { name: '\u200B', value: ' ' },
                        { name: '**Discord Registerd**', value: `${moment(interaction.member.user.createdAt)}`, inline: true },
                        { name: '\u200B', value: ' ' },
                    )
                    .setThumbnail(interaction.member.displayAvatarURL())
                    .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
                    await interaction.editReply({ embeds: [owninfoemb], allowedMentions: { repliedUser: false }})        
                }
            } else if (interaction.options.getSubcommand() === 'server') {
                //Server
                let serverowner = await interaction.guild.fetchOwner()
                let serverinfoemb = new EmbedBuilder()
                .setTitle(`Server Information for ${interaction.guild.name}`)
                .setColor(randomHexColor())
                .addFields(
                    { name: '**Server Name**', value: `${interaction.guild.name}`, inline: true },
                    { name: '**Server ID**', value: `${interaction.guild.id}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Date Created**', value: `${moment(interaction.guild.createdAt)}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Owner**', value: `${serverowner.user.tag}`, inline: true },
                    { name: '\u200B', value: ' ' },
                    { name: '**Region**', value: `${interaction.guild.preferredLocale}`, inline: true },
                )
                .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
                await interaction.editReply({ embeds: [serverinfoemb], allowedMentions: { repliedUser: false }})      
                
            }
		}
	},
};