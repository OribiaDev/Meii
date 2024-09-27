const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessunban')
		.setDescription(`Unbans a user from using confessions on the server`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Bans a user from using confessions on the server')
                .addUserOption(option => 
                    option.setName('user')
                          .setDescription('Select a user to ban from confessions')
                          .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('confession')
                .setDescription('Bans a user via confession ID from using confessions on the server')
                .addStringOption(option =>
                    option
                        .setName('confession_id')
                        .setRequired(true)
                        .setDescription('The ID of the confession, found in the footer or title'))),
	async execute(interaction, db, databaseCollections, client, shardCollections, prefix) {
        //Database Collections
        let server_data = databaseCollections.server_data;
        let confession_data = databaseCollections.confession_data;
        //Guild Document
        const guildDocument = await server_data.find({ server_id: interaction.guild.id }).toArray();
        //Confession Channel Check
        let ConfessionChannelNotSet = new EmbedBuilder()
        .setTitle(`**Moderation Error: Confession Channel Not Set**`)
        .setColor("#ff6961")
        .setDescription(`Please setup the confession channel before using this commmand.`)
        .setFooter({text:`You can set it up by doing ${prefix}settings`})  
        if(guildDocument[0]?.settings?.confession_channel_ids==undefined) return await interaction.reply({ embeds: [ConfessionChannelNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})  
        //Commands
        if (interaction.options.getSubcommand() === 'user') {
            //Confession Unban Command User
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
            .setFooter({text:`To ban this user again please use ${prefix}confessban`})
            await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
            return
        } else if (interaction.options.getSubcommand() === 'confession'){
            //Confession Unban Command Confession
            let confessbans = guildDocument[0].confession_userbans_id || []
            //Given Vars
            const confessionID = interaction.options.getString('confession_id').toUpperCase();
            //Confesson Document
            const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
            if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, ephemeral: true })
            //Get User
            let confession_author_id = confessionDocument[0].author.id;
            let confession_author_username = confessionDocument[0].author.username;
            let targetUser = await client.users.fetch(confession_author_id);
            if(confession_author_id==client.user.id) return await interaction.reply({content:"You can't ban me silly~!", ephemeral: true })
            //Push Unban
            let index = confessbans.indexOf(`${targetUser.id}`);
            if (index == -1) return await interaction.reply({content:`This user isnt banned from confessions on ${interaction.guild.name}.`, ephemeral: true })
            confessbans.splice(index, 1);
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_userbans_id: confessbans } });
            //Output
            if(targetUser){
                //User Exists
                let ConfessUnbanned = new EmbedBuilder()
                .setTitle(`**Confession: User Unbanned**`)
                .setColor("#ff6961")
                .setDescription(`${targetUser} (${targetUser.username}) has now been unbanned from confessions on ${interaction.guild.name}.`)
                .setFooter({text:`To ban this user again please use ${prefix}confessban`})
                await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
                return
            }else{
                //User does not exist
                let ConfessUnbanned = new EmbedBuilder()
                .setTitle(`**Confession: User Unbanned**`)
                .setColor("#ff6961")
                .setDescription(`${confession_author_username} has now been unbanned from confessions on ${interaction.guild.name}.`)
                .setFooter({text:`To ban this user again please use ${prefix}confessban`})
                await interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
                return
            }
        }
	},
};