const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confession')
		.setDescription(`Moderation commands for the confession command`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Bans a user from using confessions on the server')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Select a user to ban from confessions')
                          .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('unban')
                .setDescription('Unbans a user  from using confessions on the server')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Select a user to unban from confessions')
                          .setRequired(true))),
	async execute(interaction, db, databaseCollections, client, prefix) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        //Guild Document
        const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
        //Confession Channel Check
        let ConfessionChannelNotSet = new EmbedBuilder()
        .setTitle(`**Moderation Error: Confession Channel Not Set**`)
        .setColor("#ff6961")
        .setDescription(`Please setup the confession channel before using this commmand.`)
        .setFooter({text:`You can set it up by doing ${prefix}set confession_channel`})  
        if(guildDocument[0]==undefined) return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})  
        //Commands
        if (interaction.options.getSubcommand() === 'ban') {
            //Confession Ban Command
            let confessbans = guildDocument[0].confession_userbans_id || []
            let targetUser = interaction.options.getMember('user');
            if(targetUser.id==client.user.id) return await interaction.reply({content:"You can't ban me silly~!", ephemeral: true })
            let index = confessbans.indexOf(`${targetUser.id}`);
            if (index !== -1) return await interaction.reply({ content:`This user is already banned from confessions on ${interaction.guild.name}.`, ephemeral: true })
            confessbans.push(`${targetUser.id}`)            
            //Update Database
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_userbans_id: confessbans } });
            let ConfessBanned = new EmbedBuilder()
            .setTitle(`**Confession: User Banned**`)
            .setColor("#ff6961")
            .setDescription(`${targetUser} (${targetUser.user.username}) has now been banned from using confessions on ${interaction.guild.name}.`)
            .setFooter({text:`To unban this user please use ${prefix}confession unban`})
            await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
            return
        } else if (interaction.options.getSubcommand() === 'unban'){
            //Confession Unban Command
            let confessbans = guildDocument[0].confession_userbans_id || []
            let targetUser = interaction.options.getMember('user');
            let index = confessbans.indexOf(`${targetUser.id}`);
            if (index == -1) return await interaction.reply({content:`This user isnt banned from confessions on ${interaction.guild.name}.`, ephemeral: true })
            confessbans.splice(index, 1);
            //Update Database
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_userbans_id: confessbans } });
            let ConfessUnbanned = new EmbedBuilder()
            .setTitle(`**Confession: User Unbanned**`)
            .setColor("#ff6961")
            .setDescription(`${targetUser} (${targetUser.user.username}) has now been unbanned from confessions on ${interaction.guild.name}.`)
            .setFooter({text:`To ban this user again please use ${prefix}confession ban`})
            await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
            return
        }
	},
};