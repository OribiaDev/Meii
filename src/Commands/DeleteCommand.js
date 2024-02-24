const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription(`Deletes a confession (Must be a confession you posted)`)
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession, found in the footer')),
	async execute(interaction, db, databaseCollections, client) {
        await interaction.deferReply({ ephemeral: true });
        //Database Collection Vars
        let confession_data = databaseCollections.confession_data;
        //Given Vars
        const confessionID = interaction.options.getString('confession_id').toUpperCase();
        //Confession Document
        const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the bottom of the confession) is correct.`, ephemeral: true })
        //Check if the user is authorized to delete
        if(interaction.user.id!==confessionDocument[0].author.id) return interaction.editReply({content:`I'm sorry, but you are not allowed to delete the confession with the ID of **${confessionID}** as it was not sent by you.`, ephemeral: true })
        //Check if legacy document
        if(confessionDocument[0].message==undefined) return interaction.editReply({content:`I'm sorry, this is a legacy confession that does not have the message info stored, thus it cannot be deleted.`, ephemeral: true })
        //Deleting
        try{
            //Check if channel ID is valid
            try {
                let storedChannel = await client.channels.fetch(confessionDocument[0].message.channel_id);
                if (!storedChannel) return interaction.editReply({content:`I'm sorry, the stored confession channel isnt valid.`, ephemeral: true })
            } catch (error) {
                interaction.editReply({content:`I'm sorry, the stored confession channel isnt valid.`, ephemeral: true })
                return;
            }
            //Delete Message
            const storedChannel = await client.channels.fetch(confessionDocument[0].message.channel_id);
            if (storedChannel.isTextBased()) {
                //Get Message
                try{
                    const confessionMessage = await storedChannel.messages.fetch(confessionDocument[0].message.id);  
                    try{
                        //Deleting Confession
                        await confessionMessage.delete();
                        interaction.editReply({content:`The confession with the ID of **${confessionID}** has been successfully removed.`, ephemeral: true })
                        return;
                    }catch{
                        interaction.editReply({content:`I'm sorry, there has been a error deleting this confession.`, ephemeral: true })
                        return;
                    }
                }catch{
                    interaction.editReply({content:`I'm sorry, I cannot find this confession. Has it already been deleted?`, ephemeral: true })
                }
            } else {
                //Error for non text channel
                interaction.editReply({content:`I'm sorry, the stored confession channel is not a text channel.`, ephemeral: true })
                return;
            }
        } catch (error) {
            //Critical Error Catch
            interaction.editReply({content:`I'm sorry, there has been a error deleting this confession.`, ephemeral: true })
            return;
        }
	},
};