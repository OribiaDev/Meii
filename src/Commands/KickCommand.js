const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to kick')
                  .setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				  .setDescription('State the reasoning for this kick')
				  .setRequired(false)),
	async execute(interaction, db, server_data, client) {
        //Kick Block
		if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions!\nI need the \`Kick Members\` permission for this command!`, ephemeral: true }).catch(() => {return});
		let bUser = interaction.options.getMember('user');
		if(bUser.id==client.user.id) return await interaction.reply({content:"\`You can't kick me silly~!\`", ephemeral: true })
		//Kick User
		if(bUser.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ content:"\`I'm unable to kick this person as they have the kick members permission!\`", ephemeral: true });
		let reason = interaction.options.getString('reason');
		//Reason Check
		if(reason==null){
			//No Reason
			try{bUser.kick();}catch{return await interaction.reply({ content: `I'm sorry, I do not have enough permissions!\nI need the \`Kick Members\` permission for this command!`, ephemeral: true });}
			let Kicked = new EmbedBuilder()
			.setTitle(`**:leg: Moderation: User Kicked**`)
			.setColor("#ff6961")
			.setDescription(`${bUser} has been kicked from ${interaction.guild.name}!`)
			await interaction.reply({ embeds: [Kicked], allowedMentions: {repliedUser: false}})
		}else{
			try{bUser.kick({ reason: `${reason}` });}catch{return await interaction.reply({ content: `I'm sorry, I do not have enough permissions!\nI need the \`Kick Members\` permission for this command!`, ephemeral: true });}
			//Reason
			let Kicked = new EmbedBuilder()
			.setTitle(`:leg: **Moderation: User Kicked**`)
			.setColor("#ff6961")
			.setDescription(`${bUser} has been kicked from ${interaction.guild.name}! \n\n **Reason** \n ${reason}`)
			await interaction.reply({ embeds: [Kicked], allowedMentions: {repliedUser: false}})  
		}
	},
};