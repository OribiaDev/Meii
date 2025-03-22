const { SlashCommandBuilder, MessageFlags} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription(`Deletes a confession (Must be a confession you posted)`)
        .addStringOption(option =>
            option
                .setName('confession_id')
                .setRequired(true)
                .setDescription('The ID of the confession, found in the footer or title')),
	async execute(interaction, db, databaseCollections, client) {
        await interaction.deferReply({ ephemeral: true });
        //Database Collection Vars
        let confession_data = databaseCollections.confession_data;
        //Given Vars
        const confessionID = interaction.options.getString('confession_id').toUpperCase();
        //Confession Document
        const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
        if(confessionDocument[0]==undefined) return interaction.editReply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, flags: MessageFlags.Ephemeral  })
        //Check if the user is authorized to delete
        if(interaction.user.id!==confessionDocument[0].author.id) return interaction.editReply({content:`I'm sorry, but you are not allowed to delete the confession with the ID of **${confessionID}** as it was not sent by you.`, flags: MessageFlags.Ephemeral  })
        //Deleting
        try{
            return client.shard.broadcastEval(async (c, { channelId, messageID }) => {
                const channel = c.channels.cache.get(channelId);
                if (channel) {
                    try{
                        const confessionMessage = await channel.messages.fetch(messageID); 
                        if(confessionMessage){
                            //Deleting Confession
                            await confessionMessage.delete();
                            return true;
                        }
                        return false;
                    }catch{
                        return false;
                    }
                }
                return false;
            }, { context: { channelId: confessionDocument[0].message.channel_id, messageID: confessionDocument[0].message.id} })
            .then(sentArray => {
                // Search for a non falsy value before providing feedback
                if (!sentArray.includes(true)) {
                    return interaction.editReply({content:`I'm sorry, I cannot find this confession. Has it already been deleted?`, flags: MessageFlags.Ephemeral  })
                }
                return interaction.editReply({content:`The confession with the ID of **${confessionID}** has been successfully removed.`, flags: MessageFlags.Ephemeral  })
            });
        } catch (error) {
            //Critical Error Catch
            interaction.editReply({content:`I'm sorry, there has been a error deleting this confession.`, flags: MessageFlags.Ephemeral  })
            return;
        }
	},
};