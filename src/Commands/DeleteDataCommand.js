const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_data')
		.setDescription('Deletes all stored data for the current server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, db, server_data) {
        let serverOwner = await interaction.guild.fetchOwner().catch(err=>err)
        if(!interaction.member.user.id==serverOwner.id)return await interaction.reply({ content: `Only the server owner may use this command.`, allowedMentions: { repliedUser: false }, ephemeral: true })
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Deletion')
			.setStyle(ButtonStyle.Danger);
		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
		const confirmationMessage = await interaction.reply({
			content: `Are you sure you want to delete all stored data for ${interaction.guild.name}? \n**This will irreversibility delete all data associated with this server.** `,
			components: [row],
		});        
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await confirmationMessage.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'confirm') {
                //Confirm 
                const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
                if(guildDocument[0]==undefined) return await confirmation.update({ content: `Data deletion unsuccessful: There is no stored data for **${interaction.guild.name}**.`, components: [] });
                await server_data.deleteOne({ _id: guildDocument[0]._id });
                console.log(`Deleted Database Document for GuildID: ${interaction.guild.id}`)
                await confirmation.update({ content: `All data for **${interaction.guild.name}** has been successfully deleted.`, components: [] });
            } else if (confirmation.customId === 'cancel') {
                //Cancel
                await confirmation.update({ content: 'Data deletion has been successfully cancelled.', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute. cancelling.', components: [] });
        }               
    },
};