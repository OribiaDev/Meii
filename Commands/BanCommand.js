const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to ban')
                  .setRequired(true))
				  .addStringOption(option =>
			option.setName('reason')
				  .setDescription('State the reasoning for this ban')
				  .setRequired(false)),
	async execute(interaction, db, server_data, client) {
		if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions!\nI need the \`Ban Members\` permission for this command!`, ephemeral: true }).catch(() => {return;})
		let bUser = interaction.options.getMember('user');
		if(bUser.id==client.user.id) return await interaction.reply({content:"\`You can't ban me silly~!\`", ephemeral: true })
		//Ban User
		if(bUser.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ content:"\`I'm unable to ban this person as they have the ban members permission!`", ephemeral: true });
		let reason = interaction.options.getString('reason');
		//Reason Check
		if(reason==null){
			//No Reason
			bUser.ban();
			let Banned = new EmbedBuilder()
			.setTitle(`**:hammer_pick: Moderation: User Banned**`)
			.setColor("#ff6961")
			.setDescription(`${bUser} has been banned from ${interaction.guild.name}!`)
			await interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})   
		}else{
			//Reason
			bUser.ban({ reason: `${reason}` });
			let Banned = new EmbedBuilder()
			.setTitle(`:hammer_pick: **Moderation: User Banned**`)
			.setColor("#ff6961")
			.setDescription(`${bUser} has been banned from ${interaction.guild.name}! \n\n **Reason** \n ${reason}`)
			await interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})  
		}
	},
};