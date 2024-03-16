const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_data')
		.setDescription('Deletes all stored data for the current server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        //Command
        let serverOwner = await interaction.guild.fetchOwner().catch(err=>err)
        if(!interaction.member.user.id==serverOwner.id)return await interaction.reply({ content: `Only the server owner may use this command.`, allowedMentions: { repliedUser: false }, ephemeral: true })
		const confirm = new ButtonBuilder()
			.setCustomId('delete_data-confirm')
			.setLabel('Confirm Deletion')
			.setStyle(ButtonStyle.Danger);
		const cancel = new ButtonBuilder()
			.setCustomId('delete_data-cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
		await interaction.reply({
			content: `Are you sure you want to delete all stored data for ${interaction.guild.name}? \n**This will irreversibility delete all data associated with this server.** `,
			components: [row],
		});              
    },
    async handleButton(interaction, db, databaseCollections) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        //Permission Check
        if(interaction.user.id !== interaction.message.interaction.user.id) return interaction.reply({content:"Im sorry, you cannot use this button!", ephemeral: true })
        //Buttons
        if (interaction.customId === 'delete_data-confirm') {
            //Confirm 
            const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
            if(guildDocument[0]==undefined) return await interaction.update({ content: `Data deletion unsuccessful: There is no stored data for **${interaction.guild.name}**.`, components: [] });
            await server_data.deleteOne({ _id: guildDocument[0]._id });
            console.log(`Deleted Database Document for GuildID: ${interaction.guild.id}`)
            await interaction.update({ content: `All data for **${interaction.guild.name}** has been successfully deleted.`, components: [] });
        } else if (interaction.customId === 'delete_data-cancel') {
            //Cancel
            await interaction.update({ content: 'Data deletion has been successfully cancelled.', components: [] });
        }
    },
};