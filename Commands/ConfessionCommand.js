const { EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const randomHexColor = require('random-hex-color')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	name: 'confess',
	description: 'Submit a confession!',
	async execute(message, args, client, prefix) {
        //Database Login
        const pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            connectionLimit: 100,
        });
        //Lazy Error Handling
        function stoperror() {
            return true;
        }
        //Gets Guilds from all shared servers
        const guilds = [];
        for (const [, guild] of message.client.guilds.cache) {
            await guild.members.fetch(message.author.id).then(() => guilds.push(guild)).catch(error => stoperror());
        }
        //Converts guilds into legible format
        const servers = [];
        for (let i = 0; i < Object.keys(guilds).length;i++) {
            servers.push({ name: Object.entries(guilds)[i][1].name, id: Object.entries(guilds)[i][1].id, key: i});
        }
        //Makes into embed format
        var FullEmbed = "";
        for (let i = 0; i < Object.keys(servers).length;i++) {
            FullEmbed = FullEmbed + `${Object.entries(servers)[i][1].name} (**${Object.entries(servers)[i][1].key+1}**)\n` 
        }
        const filter = m => m.author.id == message.author.id
        let ServerSelect = new EmbedBuilder()
        .setTitle(`**Confession: Server Select**`)
        .setColor('#77DD77')
        .addFields(
            { name: '**Server/s:**', value: `${FullEmbed}`, inline: true },    
            { name: '\u200B', value: ' ' },       
        )
        .setDescription(`Please reply with the number next to the \ncorresponding server you wish to confess too! \n\u200B`)
        .setFooter({text:`You have 1 minute to respond. | Type 'cancel' to cancel.`})
        message.author.send({ embeds: [ServerSelect], allowedMentions: {repliedUser: false}})
        //Collects Server ID
        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected =>{
            if(collected.first().content.toLocaleLowerCase() === `cancel`){
                let CancelEmbed = new EmbedBuilder()
                .setTitle(`**Confession: Canceled**`)
                .setColor("#ff6961")
                .setDescription(`Your confession is now canceled.`)
                return message.reply({ embeds: [CancelEmbed], allowedMentions: {repliedUser: false}})
            }
            //Gets server data from given ID
            let GivenID = collected.first().content
            //Server Check
            if(Object.entries(servers)[GivenID - 1] === undefined){
                let ServerIDInvalid = new EmbedBuilder()
                .setTitle(`**Confession: Number Invalid**`)
                .setColor('#ff6961')
                .setDescription(`Im sorry, but the number you entered is invalid. Please try again.`)
                .setFooter({text:`You can try again by typing 'confess'.`})
                return message.author.send({ embeds: [ServerIDInvalid], allowedMentions: {repliedUser: false}})      
            }
            let ServerID = Object.entries(servers)[GivenID - 1][1].id
            let server = client.guilds.cache.find(guild => guild.id === ServerID)
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
                    .setFooter({text:`You can set it up by doing ${prefix}setconfesschannel`})
                    return message.author.send({ embeds: [ConfessionNotSet], allowedMentions: {repliedUser: false}})  
                }
                //No Confess Channel
                if(JSON.stringify(result[0].confession_channel_ids)=='null'){
                    let ConfessionNotSet = new EmbedBuilder()
                    .setTitle(`**${server.name}: Confession Channel Not Set**`)
                    .setColor('#ff6961')
                    .setDescription(`Im sorry, the confession channel is not setup for **${server.name}**.`)
                    .setFooter({text:`You can set it up by doing ${prefix}setconfesschannel`})
                    return message.author.send({ embeds: [ConfessionNotSet], allowedMentions: {repliedUser: false}})
                }else{
                    //Check if user is confession banned
                    var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${server.id};`; 
                    pool.query(sql, function (err, result) {
                        if (err) throw err;
                        if(JSON.stringify(result[0].confession_userbans_ids).includes(message.author.id)){
                            let ConfessionIsBanned = new EmbedBuilder()
                            .setTitle(`**${server.name}: Confession Banned**`)
                            .setColor("#ff6961")
                            .setDescription(`Im sorry, you're banned from using confessions in **${server.name}**.`)
                            .setFooter({text:`If you think this is a mistake, please contact a staff member.`})
                            message.author.send({ embeds: [ConfessionIsBanned], allowedMentions: {repliedUser: false}})
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
                                .setFooter({text:`If you think this is a error, try re-setting the confession channel.`})
                                if(!client.channels.cache.get(result[0].confession_channel_ids)){
                                    return message.author.send({ embeds: [ConfessionError] })
                                }else{
                                let confessionchannel = client.channels.cache.get(result[0].confession_channel_ids)
                                let ConfessionStart = new EmbedBuilder()
                                .setTitle(`**Confession: ${server.name}**`)
                                .setColor('#77DD77')
                                .setDescription(`What would you like to confess? Type below to submit your confession. \n\n Your confession will be posted to ${confessionchannel}`)
                                .setFooter({text:`You have 1 minute to respond. | Type 'cancel' to cancel.`})
                                message.channel.send({ embeds: [ConfessionStart], allowedMentions: {repliedUser: false}})
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => { 
                                    let confessedmessage = collected.first().content
                                    if(confessedmessage.toLocaleLowerCase() === `cancel`){
                                        let CancelEmbed = new EmbedBuilder()
                                        .setTitle(`**Confession: Canceled**`)
                                        .setColor("#ff6961")
                                        .setDescription(`Your confession is now canceled.`)
                                        return message.reply({ embeds: [CancelEmbed], allowedMentions: {repliedUser: false}})
                                    }
                                    if(!confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel) || !confessionchannel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                                        message.channel.send('\`Im sorry, I dont have enough permissions to send messages in the set confession channel\`')
                                        return
                                    }
                                    let Confession = new EmbedBuilder()
                                    .setTitle(`**:love_letter: Anonymous Confession**`)
                                    .setColor(randomHexColor())
                                    .setDescription(`> ${confessedmessage}`)
                                    .setTimestamp()
                                    confessionchannel.send({ embeds: [Confession], allowedMentions: {repliedUser: false}})
                                    message.author.send(`:thumbsup: Your confession has now been added to **${confessionchannel}**`);
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
                                                .setDescription(`"${confessedmessage}" \n\n **User**  \n ||${message.author.username}  (${message.author})||`)
                                                .setTimestamp()
                                                confessionmodchannel.send({ embeds: [ConfessionLog], allowedMentions: {repliedUser: false}})    
                                            }
                                        }
                                
                                    });  

                                }).catch((error) => {
                                    message.channel.send("\`No response; Canceling\`")
                                });                                        

                                } 
                            });  
                        }
                
                    });  
                }

            });  
        }).catch((error) => {
            message.channel.send("\`No response; Canceling\`")
        });   
	},
};