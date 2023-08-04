const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('Submit an anonymous confession')
        .addStringOption(option =>
            option
                .setName('message')
                .setRequired(true)
                .setDescription('The message you want to confess')),
	async execute(interaction, pool, args, client, prefix) {
        await interaction.deferReply({ ephemeral: true });
        //Guild Var
        const server = interaction.guild;
        //Database Confession Channel Check
        var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
        pool.query(sql, function (err, result) {
            if (err) throw err;
            //No Database for guild (Thus no confess channel)
            if(result[0]==undefined){
                let ConfessionNotSet = new EmbedBuilder()
                .setTitle(`**${server.name}: Confession Channel Not Set**`)
                .setColor('#ff6961')
                .setDescription(`Im sorry, the confession channel is not setup for **${server.name}**.`)
                .setFooter({text:`Ask a staff member to set it up with ${prefix}setconfesschannel`})
                return interaction.editReply({ embeds: [ConfessionNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})  
            }
            //No Confess Channel
            if(JSON.stringify(result[0].confession_channel_ids)=='null'){
                let ConfessionNotSet = new EmbedBuilder()
                .setTitle(`**${server.name}: Confession Channel Not Set**`)
                .setColor('#ff6961')
                .setDescription(`Im sorry, the confession channel is not setup for **${server.name}**.`)
                .setFooter({text:`Ask a staff member to set it up with ${prefix}setconfesschannel`})
                return interaction.editReply({ embeds: [ConfessionNotSet], ephemeral: true, allowedMentions: {repliedUser: false}})
            }else{
                //Check if user is confession banned
                var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${server.id};`; 
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    if(JSON.stringify(result[0].confession_userbans_ids).includes(interaction.member.id)){
                        let ConfessionIsBanned = new EmbedBuilder()
                        .setTitle(`**${server.name}: Confession Banned**`)
                        .setColor("#ff6961")
                        .setDescription(`Im sorry, you're banned from using confessions in **${server.name}**.`)
                        .setFooter({text:`If you think this is a mistake, please contact a staff member.`})
                        interaction.editReply({ embeds: [ConfessionIsBanned], ephemeral: true, allowedMentions: {repliedUser: false}})
                        return
                    }else{
                        //Confession Channel Error
                        var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
                        pool.query(sql, function (err, result) {
                            if (err) throw err;
                            let ConfessionError = new EmbedBuilder()
                            .setTitle(`**${server.name}: Confession Channel Error**`)
                            .setColor('#ff6961')
                            .setDescription(`Im sorry, im having trouble finding the confession channel in **${server.name}**.`)
                            .setFooter({text:`Tell a staff member to re-set the confession channel!`})
                            if(!client.channels.cache.get(result[0].confession_channel_ids)){
                                return interaction.editReply({ embeds: [ConfessionError], ephemeral: true,})
                            }else{
                                let confessionchannel = client.channels.cache.get(result[0].confession_channel_ids)
                                if(!confessionchannel) return interaction.editReply({ embeds: [ConfessionError], ephemeral: true,})
                                let confessedmessage = interaction.options.getString('message');
                                if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return interaction.editReply({ content: `\`Im sorry, I dont have enough permissions to send messages in the set confession channel\``, ephemeral: true })
                                let Confession = new EmbedBuilder()
                                .setTitle(`**:love_letter: Anonymous Confession**`)
                                .setColor(randomHexColor())
                                .setDescription(`> ${confessedmessage}`)
                                .setTimestamp()
                                confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}})
                                interaction.editReply({ content: `Your confession has now been added to **${confessionchannel}**  :thumbsup: `, ephemeral: true });
                                //Mod Log Send
                                var sql = `SELECT confession_modlog_ids FROM server_data WHERE server_id = ${server.id};`; 
                                pool.query(sql, function (err, result) {
                                    if (err) throw err;
                                    //Mod Log Error Check
                                    if(JSON.stringify(result[0].confession_modlog_ids)=='null') return
                                    if(!client.channels.cache.get(result[0].confession_modlog_ids)) return
                                    //Mod Log Send
                                    let confessionmodchannel = client.channels.cache.get(result[0].confession_modlog_ids)
                                    if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return                 
                                    let ConfessionLog = new EmbedBuilder()
                                    .setTitle(`:love_letter: **Anonymous Confession**`)
                                    .setColor(randomHexColor())
                                    .setDescription(`"${confessedmessage}" \n\n **User**  \n ||${interaction.member.user.username}  (${interaction.member})||`)
                                    .setTimestamp()
                                    confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                                });                                      
                            } 
                        });  
                    }
            
                });  
            }

        });  
	},
};