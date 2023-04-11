const { SlashCommandBuilder, Permissions } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kick a user!')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kick!')
                  .setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				  .setDescription('State the reasoning for this kick!')
				  .setRequired(false)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        //Kick Block
		if(interaction.content==undefined){
			//Interaction
			if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)){
                return await interaction.editReply({ content: `I'm sorry, I do not have enough permissions!\nI need the \`Kick Members\` permission for this command!`, ephemeral: true }).catch(() => {
                    return;
                })
            }
			let bUser = interaction.options.getMember('user');
			if(bUser.id=='1082401009206308945' || bUser.id=='1082402034759766016') return await interaction.editReply({content:"\`You can't kick me silly~!\`", ephemeral: true })
			//Kick User
			if(bUser.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.editReply({ content:"\`I'm unable to kick this person!\`", ephemeral: true });
			let reason = interaction.options.getString('reason');
			//Reason Check
			if(reason==null){
				//No Reason
				bUser.kick();
				let Kicked = new EmbedBuilder()
				.setTitle(`**:leg: Moderation: User Kicked**`)
				.setColor("#FF0000")
				.setDescription(`${bUser} has been kicked from ${interaction.guild.name}!`)
				await interaction.editReply({ embeds: [Kicked], allowedMentions: {repliedUser: false}})   
			}else{
				//Reason
				bUser.kick({ reason: `${reason}` });
				let Kicked = new EmbedBuilder()
				.setTitle(`:leg: **Moderation: User Kicked**`)
				.setColor("#FF0000")
				.setDescription(`${bUser} has been kicked from ${interaction.guild.name}! \n\n **Reason** \n ${reason}`)
				await interaction.editReply({ embeds: [Kicked], allowedMentions: {repliedUser: false}})  
			}
		}   
	},
};