const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
var randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user!')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to ban!')
                  .setRequired(true))
				  .addStringOption(option =>
			option.setName('reason')
				  .setDescription('State the reasoning for this ban!')
				  .setRequired(false)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		//Ban Block
		if(interaction.content==undefined){
			//Interaction
			if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)){
				return interaction.reply({ content: `I'm sorry, I do not have enough permissions!\nI need the **Ban Members** permission for this command!`, ephemeral: true }).catch(() => {
					return;
				})
			}
			let bUser = interaction.options.getMember('user');
			if(!bUser) return interaction.reply({ content:":no_entry: Can't find that user! please mention the user in the command!", ephemeral: true });
			if(bUser.id=='1082401009206308945' || bUser.id=='1082402034759766016') return interaction.reply({content:":no_entry: You can't ban me silly~!", ephemeral: true })
			//Ban User
			if(bUser.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content:":no_entry:  I'm unable to ban this person!", ephemeral: true });
			let reason = interaction.options.getString('reason');
			//Reason Check
			if(reason==null){
				//No Reason
				bUser.ban();
				let Banned = new EmbedBuilder()
				.setTitle(`**:hammer_pick: Moderation: User Banned**`)
				.setColor("#FF0000")
				.setDescription(`${bUser} has been banned from ${interaction.guild.name}!`)
				interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})   
			}else{
				//Reason
				bUser.ban({ reason: `${reason}` });
				let Banned = new EmbedBuilder()
				.setTitle(`:hammer_pick: **Moderation: User Banned**`)
				.setColor("#FF0000")
				.setDescription(`${bUser} has been banned from ${interaction.guild.name}! \n\n **Reason** \n ${reason}`)
				interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})  
			}
		} 
		
	},
};