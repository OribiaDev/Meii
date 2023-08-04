const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checklogs')
		.setDescription('Checks if confession logs are enabled in the server'),
	async execute(interaction, pool) {
        //Checks if confession log exists in database
        var sql = `SELECT confession_modlog_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
        pool.query(sql, async function (err, result) {
            if (err) throw err;
            //If No Mod Log
            if(JSON.stringify(result[0].confession_modlog_ids)=='null'){
                await interaction.reply({ content: `Confessions are not logged on ${interaction.guild.name}.`, ephemeral: true }); 
            }else{
                //If Mod Log
                await interaction.reply({ content: `Confessions are logged on ${interaction.guild.name} with user information for moderation purposes.`, ephemeral: true });   
            }
        });  
	},
};