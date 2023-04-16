const { EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	name: 'confess',
	description: 'Submit a confession!',
	execute(message, args, client, prefix) {
        //DM Message
        if(message.guild) return
        //Database Login
        const pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            connectionLimit: 100,
        });
        
        const filter = m => m.author.id == message.author.id
        let ServerSelect = new EmbedBuilder()
        .setTitle(`**Server Select**`)
        .setColor(randomHexColor())
        .setDescription(`Please reply with the exact name or ID of the server you wish to confess too! \n __spelling and capitalization counts!__`)
        .setFooter({text:`You have 1 minute to respond | type "cancel" to cancel`})
        message.author.send({ embeds: [ServerSelect], allowedMentions: {repliedUser: false}})
        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected =>{
            if(collected.first().content.toLocaleLowerCase() === `cancel`){
                let CancelEmbed = new EmbedBuilder()
                .setTitle(`**Confession: Canceled**`)
                .setColor("#FF0000")
                .setDescription(`Your confession is now canceled`)
                return message.reply({ embeds: [CancelEmbed], allowedMentions: {repliedUser: false}})
            }
            //Name
            if(client.guilds.cache.find(guild => guild.name === collected.first().content)){ 
                let server = client.guilds.cache.find(guild => guild.name === collected.first().content)
                //Database Confession Channel Check
                var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
                pool.query(sql, function (err, result) {
                    if (err) throw err;
                    if(JSON.stringify(result[0].confession_channel_ids)=='null'){
                        let ConfessionNotSet = new EmbedBuilder()
                        .setTitle(`**Confession: Confession Channel Not Set**`)
                        .setColor(randomHexColor())
                        .setDescription(`Im sorry, the confession channel is not setup for this server!`)
                        .setFooter({text:`You can set it up by doing ${prefix}setconfesschannel`})
                        return message.author.send({ embeds: [ConfessionNotSet], allowedMentions: {repliedUser: false}})
                    }else{
                        //Check if user is confession banned
                        var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${server.id};`; 
                        pool.query(sql, function (err, result) {
                            if (err) throw err;
                            if(JSON.stringify(result[0].confession_userbans_ids).includes(message.author.id)){
                                let ConfessionIsBanned = new EmbedBuilder()
                                .setTitle(`**Confession Banned: ${server.name}**`)
                                .setColor("#FF0000")
                                .setDescription(`You are banned from using confessions in **${server.name}!**`)
                                .setFooter({text:`If you think this is a mistake, please contact a staff member`})
                                message.author.send({ embeds: [ConfessionIsBanned], allowedMentions: {repliedUser: false}})
                                return
                            }else{
                                //Confession Channel Error
                                var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
                                pool.query(sql, function (err, result) {
                                       if (err) throw err;
                                       let ConfessionError = new EmbedBuilder()
                                       .setTitle(`**Confession: Confession Channel Error**`)
                                       .setColor(randomHexColor())
                                       .setDescription(`Im sorry, im having trouble finding the confession channel for that server!`)
                                       .setFooter({text:`If you think this is a error, try re-setting the confession channel!`})
                                       if(!client.channels.cache.get(result[0].confession_channel_ids)){
                                            return message.author.send({ embeds: [ConfessionError] })
                                       }else{
                                        let confessionchannel = client.channels.cache.get(result[0].confession_channel_ids)
                                        let ConfessionStart = new EmbedBuilder()
                                        .setTitle(`**Confession: ${server.name}**`)
                                        .setColor(randomHexColor())
                                        .setDescription(`What would you like to confess? Reply below to submit your confession. \n\n Your confession will be __anonymously posted__ to ${confessionchannel} in ${server.name}`)
                                        .setFooter({text:`You have 1 minute to respond | type "cancel" to cancel`})
                                        message.channel.send({ embeds: [ConfessionStart], allowedMentions: {repliedUser: false}})
                                        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => { 
                                            let confessedmessage = collected.first().content
                                            if(confessedmessage.toLocaleLowerCase() === `cancel`){
                                                let CancelEmbed = new EmbedBuilder()
                                                .setTitle(`**Confession: Canceled**`)
                                                .setColor("#FF0000")
                                                .setDescription(`Your confession is now canceled`)
                                                return message.reply({ embeds: [CancelEmbed], allowedMentions: {repliedUser: false}})
                                            }
                                            if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                                                message.channel.send('\`Im sorry, I dont have enough permissions to send messages in the set confession channel\`')
                                                return
                                            }
                                            var currentDateAndTime = new Date().toLocaleString();
                                            let Confession = new EmbedBuilder()
                                            .setTitle(`**:love_letter: Anonymous Confession**`)
                                            .setColor(randomHexColor())
                                            .setDescription(`> ${confessedmessage}`)
                                            .setFooter({text:`${currentDateAndTime}`})
                                            confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}})
                                            message.author.send(`:thumbsup: Your confession has now been added to **${confessionchannel}** in **${server.name}**`);
                                            //Mod Log Send
                                            var sql = `SELECT confession_modlog_ids FROM server_data WHERE server_id = ${server.id};`; 
                                            pool.query(sql, function (err, result) {
                                                if (err) throw err;
                                                if(JSON.stringify(result[0].confession_modlog_ids)=='null'){
                                                    return
                                                }else{
                                                    //Mod Log Error Check
                                                    if(!client.channels.cache.get(result[0].confession_modlog_ids)){
                                                        return
                                                    }else{
                                                        //Mod Log Send
                                                        let confessionmodchannel = client.channels.cache.get(result[0].confession_modlog_ids)
                                                        if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                                                            return 
                                                        }
                                                        let ConfessionLog = new EmbedBuilder()
                                                        .setTitle(`:love_letter: **Anonymous Confession**`)
                                                        .setColor(randomHexColor())
                                                        .setDescription(`"${confessedmessage}" \n\n **User**  \n ||${message.author.tag}  (${message.author})||`)
                                                        .setFooter({text:`${currentDateAndTime}`})
                                                        confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                                                    }
                                                }
                                       
                                            });  
     
                                        }).catch((error) => {
                                            message.reply("\`No response, canceling\`")
                                        });                                        

                                       } 
                                });  
                            }
                   
                        });  
                    }

                });  

                
            }else{
                //ID Confessions
                if(client.guilds.cache.find(guild => guild.id === collected.first().content)){
                    let server = client.guilds.cache.find(guild => guild.id === collected.first().content)
                    //Confession Channel Check
                    var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
                    pool.query(sql, function (err, result) {
                        if (err) throw err;
                        if(JSON.stringify(result[0].confession_channel_ids)=='null'){
                            let ConfessionNotSet = new EmbedBuilder()
                            .setTitle(`**Confession: Confession Channel Not Set**`)
                            .setColor(randomHexColor())
                            .setDescription(`Im sorry, the confession channel is not setup for this server!`)
                            .setFooter({text:`You can set it up by using ${prefix}setconfesschannel`})
                            return message.author.send({ embeds: [ConfessionNotSet], allowedMentions: {repliedUser: false}})
                        }else{
                            //Check if user is banned
                            var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${server.id};`; 
                            pool.query(sql, function (err, result) {
                                if (err) throw err;
                                if(JSON.stringify(result[0].confession_userbans_ids).includes(message.author.id)){
                                    let ConfessionIsBanned = new EmbedBuilder()
                                    .setTitle(`**Confession Banned: ${server.name}**`)
                                    .setColor("#FF0000")
                                    .setDescription(`You are banned from using confessions in **${server.name}!**`)
                                    .setFooter({text:`If you think this is a mistake, please contact a staff member`})
                                    message.author.send({ embeds: [ConfessionIsBanned], allowedMentions: {repliedUser: false}})
                                    return
                                }else{
                                    //Confession Channel Error
                                    var sql = `SELECT confession_channel_ids FROM server_data WHERE server_id = ${server.id};`; 
                                    pool.query(sql, function (err, result) {
                                        if (err) throw err;
                                        if(!client.channels.cache.get(result[0].confession_channel_ids)){
                                            let ConfessionError = new EmbedBuilder()
                                            .setTitle(`**Confession: Confession Channel Error**`)
                                            .setColor(randomHexColor())
                                            .setDescription(`Im sorry, im having trouble finding the confession channel for that server!`)
                                            .setFooter({text:`If you think this is a error, try re-setting the confession channel!`})
                                            return message.author.send({ embeds: [ConfessionError], allowedMentions: {repliedUser: false}})
                                        }else{
                                            let confessionchannel = client.channels.cache.get(result[0].confession_channel_ids)
                                            let ConfessionStart = new EmbedBuilder()
                                            .setTitle(`**Confession: ${server.name}**`)
                                            .setColor(randomHexColor())
                                            .setDescription(`What would you like to confess? Reply below to submit your confession. \n\n Your confession will be __anonymously posted__ to ${confessionchannel} in ${server.name}`)
                                            .setFooter({text:`You have 1 minute to respond | type "cancel" to cancel`})
                                            message.channel.send({ embeds: [ConfessionStart], allowedMentions: {repliedUser: false}})
                                            message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => { 
                                                let confessedmessage = collected.first().content
                                                if(confessedmessage.toLocaleLowerCase() === `cancel`){
                                                    let CancelEmbed = new EmbedBuilder()
                                                    .setTitle(`**Confession: Canceled**`)
                                                    .setColor("#FF0000")
                                                    .setDescription(`Your confession is now canceled`)
                                                    return message.reply({ embeds: [CancelEmbed], allowedMentions: {repliedUser: false}})
                                                }
                                                if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                                                    message.channel.send('\`Im sorry, I dont have enough permissions to send messages in the set confession channel\`')
                                                    return
                                                }
                                                var currentDateAndTime = new Date().toLocaleString();
                                                let Confession = new EmbedBuilder()
                                                .setTitle(`**:love_letter: Anonymous Confession**`)
                                                .setColor(randomHexColor())
                                                .setDescription(`> ${confessedmessage}`)
                                                .setFooter({text:`${currentDateAndTime}`})
                                                confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}})
                                                message.author.send(`:thumbsup: Your confession has now been added to **${confessionchannel}** in **${server.name}**`);
                                                //Mod Log Check
                                                var sql = `SELECT confession_modlog_ids FROM server_data WHERE server_id = ${server.id};`; 
                                                pool.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    if(JSON.stringify(result[0].confession_modlog_ids)=='null'){
                                                        return
                                                    }else{
                                                        //Mod Log Error Check
                                                        if(!client.channels.cache.get(result[0].confession_modlog_ids)){
                                                            return
                                                        }else{
                                                            //Mod Log Send
                                                            let confessionmodchannel = client.channels.cache.get(result[0].confession_modlog_ids)
                                                            if(!confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionmodchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                                                                return 
                                                            }
                                                            let ConfessionLog = new EmbedBuilder()
                                                            .setTitle(`:love_letter: **Anonymous Confession**`)
                                                            .setColor(randomHexColor())
                                                            .setDescription(`"${confessedmessage}" \n\n **User**  \n ||${message.author.tag}  (${message.author})||`)
                                                            .setFooter({text:`${currentDateAndTime}`})
                                                            confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                                                        }
                                                    }
                                           
                                                });  
                                            }).catch(() => {
                                                message.reply("\`No response, canceling\`")
                                            });



                                        }
                               
                                    });  
                                }
                       
                            });  
                        }
                    });  
                }else{
                    //Cannot Find
                    let CannotFindServer = new EmbedBuilder()
                        .setTitle(`:love_letter: **Confession: Cannot Find Server**`)
                        .setColor(randomHexColor())
                        .setDescription(`Im sorry, I cannot find that server! \n Please double check that you have the server name or the server ID correct!`)
                    message.author.send({ embeds: [CannotFindServer], allowedMentions: {repliedUser: false}})
                }
            }
            

        }).catch((error) => {
            message.reply("\`No response, canceling\`")
        });   
	},
};