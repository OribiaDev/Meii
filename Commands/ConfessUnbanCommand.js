const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessunban')
		.setDescription('Unbans a user from confessions!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to unban from confessions!')
                  .setRequired(true)),
	async execute(interaction, pool, args, client, prefix) {
        //Database Block
        var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`; 
        pool.query(sql, async function (err, result) {
            if (err) throw err;
            let confessbans = result[0].confession_userbans_ids;
            let bUser = interaction.options.getMember('user');
            if(!confessbans.includes(bUser.id)) return await interaction.reply({content:`\`This user isnt banned from confessions on ${interaction.guild.name}!\``, ephemeral: true })
            var finalconfessbanlist = confessbans.replace(new RegExp(bUser.id,'g'), "")
            //Confess Unban User
            var sql = `UPDATE server_data SET confession_userbans_ids = '${String(finalconfessbanlist)}' WHERE server_id = ${interaction.guild.id};`; 
            pool.query(sql, async function (err, result) {
                if (err) throw err;
                let ConfessUnbanned = new EmbedBuilder()
                .setTitle(`**Confession: User Unbanned**`)
                .setColor("#ff6961")
                .setDescription(`${bUser} (${bUser.id}) has now been unbanned from using confessions on ${interaction.guild.name}!`)
                .setFooter({text:`To ban this user again, do '${prefix}confessban'`})
                await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
                return
            });  
            
        });  
	},
};