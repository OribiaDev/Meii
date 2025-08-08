const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessban')
		.setDescription(`Bans a user from using confessions on the server`)
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
	async execute(interaction, db, databaseCollections, client, shardCollections) {
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
        .setFooter({text:`You can set it up by doing /settings`})  
        if(guildDocument[0]?.settings?.confession_channel_ids==undefined) return await interaction.reply({ embeds: [ConfessionChannelNotSet], flags: MessageFlags.Ephemeral , allowedMentions: {repliedUser: false}})  
        //Commands
        if (interaction.options.getSubcommand() === 'user') {
            //Confession Ban User
            let confessbans = guildDocument[0].confession_userbans_id || []
            let targetUser = interaction.options.getMember('user');
            if(targetUser.id==client.user.id) return await interaction.reply({content:"You can't ban me silly~!", flags: MessageFlags.Ephemeral  })
            let index = confessbans.indexOf(`${targetUser.id}`);
            if (index !== -1) return await interaction.reply({ content:`This user is already banned from confessions on ${interaction.guild.name}.`, flags: MessageFlags.Ephemeral  })
            confessbans.push(`${targetUser.id}`)            
            //Update Database
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_userbans_id: confessbans } });
            let ConfessBanned = new EmbedBuilder()
            .setTitle(`**Confession: User Banned**`)
            .setColor("#ff6961")
            .setDescription(`${targetUser} (${targetUser.user.username}) has now been banned from using confessions on ${interaction.guild.name}.`)
            .setFooter({text:`To unban this user please use /confessunban`})
            await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
            return
        } else if (interaction.options.getSubcommand() === 'confession'){
            //Confession Ban Confession
            let confessbans = guildDocument[0].confession_userbans_id || []
            //Given Vars
            const confessionID = interaction.options.getString('confession_id').toUpperCase();
            //Confession Document
            const confessionDocument = await confession_data.find({ confession_id: confessionID }).toArray();
            if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${confessionID}**.\nPlease make sure the confession ID (found at the footer or title of the confession) is correct.`, flags: MessageFlags.Ephemeral  })
            //Get User
            let confession_author_id = confessionDocument[0].author.id;
            let confession_author_username = confessionDocument[0].author.username;
            let targetUser = await client.users.fetch(confession_author_id);
            if(confession_author_id==client.user.id) return await interaction.reply({content:"You can't ban me silly~!", flags: MessageFlags.Ephemeral  })
            //Push Ban
            let index = confessbans.indexOf(`${confession_author_id}`);
            if (index !== -1) return await interaction.reply({ content:`This user is already banned from confessions on ${interaction.guild.name}.`, flags: MessageFlags.Ephemeral  })
            confessbans.push(`${confession_author_id}`)        
            await server_data.updateOne({ server_id: `${interaction.guild.id}` }, { $set: { confession_userbans_id: confessbans } });
            //Output
            if(targetUser){
                //User Still Exists
                let ConfessBanned = new EmbedBuilder()
                .setTitle(`**Confession: User Banned**`)
                .setColor("#ff6961")
                .setDescription(`That user has now been banned from using confessions on ${interaction.guild.name}.`)
                .setFooter({text:`To unban this user please use /confessunban`})
                await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
                return
            }else{
                //User Does Not Exist
                let ConfessBanned = new EmbedBuilder()
                .setTitle(`**Confession: User Banned**`)
                .setColor("#ff6961")
                .setDescription(`That user has now been banned from using confessions on ${interaction.guild.name}.`)
                .setFooter({text:`To unban this user please use /confessunban`})
                await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
                return
            }
        }
	},
};