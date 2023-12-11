const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checklogs')
		.setDescription('Checks if confession logs are enabled in the server'),
	async execute(interaction, db, databaseCollections) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        //No Document for guild (Thus no log channel)
        const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
        if(guildDocument[0]==undefined) return await interaction.reply({ content: `Confessions are not logged or setup on ${interaction.guild.name}.`, ephemeral: true });
        //Checks if log channel exists in document
        if(guildDocument[0].confession_modlog_id==undefined){
            //If No Mod Log
            await interaction.reply({ content: `Confessions are not logged on ${interaction.guild.name}.`, ephemeral: true }); 
        }else{
            //If Mod Log
            await interaction.reply({ content: `Confessions are logged on ${interaction.guild.name} with user information for moderation purposes.`, ephemeral: true });   
        }
	},
};