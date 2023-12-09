const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

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
	async execute(interaction, db, server_data, bot_data, client) {
		//Permissions Check
		if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions.\nI need.. \`Ban Members\``, ephemeral: true }).catch(() => {return;})
		//Get User
		let targetUser = interaction.options.getMember('user');
		if(targetUser==null) return await interaction.reply({ content: `I'm sorry, there has been an error. Please try again.`, allowedMentions: { repliedUser: false }, ephemeral: true }) 
		if(targetUser.id==client.user.id) return await interaction.reply({content:"You can't ban me silly~!", ephemeral: true })
		//Target Permission Checks
		if(!targetUser.bannable) return await interaction.reply({ content:"I'm unable to ban this person as they either have the \`Ban Members\` permission or they have a higher role than me.", ephemeral: true });
		//Reason Check
		let reason = interaction.options.getString('reason');
		if(reason==null){
			//No Reason
			targetUser.ban()
			let Banned = new EmbedBuilder()
			.setTitle(`**:hammer_pick: Moderation: User Banned**`)
			.setColor("#ff6961")
			.setDescription(`${targetUser} has been banned from ${interaction.guild.name}!`)
			.setFooter({text: 'The ban hammer has spoken!'})
			await interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})  
		}else{
			// w/ Reason
			targetUser.ban({ reason: `${reason}` });
			let Banned = new EmbedBuilder()
			.setTitle(`:hammer_pick: **Moderation: User Banned**`)
			.setColor("#ff6961")
			.setDescription(`${targetUser} has been banned from ${interaction.guild.name}! \n\n **Reason** \n ${reason}`)
			.setFooter({text: 'The ban hammer has spoken!'})
			await interaction.reply({ embeds: [Banned], allowedMentions: {repliedUser: false}})  
		}
	},
};