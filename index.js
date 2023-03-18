//Imports
const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, Events } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { main_token, dev_token, host, user, password, database } = require('./Jsons/config.json');
const mysql = require('mysql');
const fs = require('fs');


//Intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });

//Variables
const prefix = '/'
const BotDevID = '1082402034759766016'
const mainclientId = '1082401009206308945' 

// DEV TOGGLE
var token;
const IsDev = false

//Token Changer
if(IsDev){
    token = dev_token;
}else{
    token = main_token;
}
var token;

//Bot Login
client.login(token)

//Command Handler 
function CommandRefresh(){
    const slashcommands = [];
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
    //Refresh Command List
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);
        try {
            client.commands.set(command.data.name, command);
            slashcommands.push(command.data.toJSON());     
        } catch {
            client.commands.set(command.name, command);
            
        }
    }
    const rest = new REST({ version: '10' }).setToken(token);
    //Push Slash Commands to Discord API
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            if(IsDev){
                await rest.put(
                    //Dev Client
                    Routes.applicationCommands(BotDevID),
                    { body: slashcommands },
                );
            }else{
                await rest.put(
                    //Global Client
                    Routes.applicationCommands(mainclientId),
                    { body: slashcommands },
                );
            }
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
    setTimeout(() => {
        //Refresh every hour
        console.log('Stared Automatic Refresh of Commands')
        CommandRefresh();
      }, 60000 * 60);
}

//Manual Command Handler
function ManualCommandRefresh(){
    const slashcommands = [];
    client.commands = new Collection();
    const mainclientId = '1082401009206308945'
    const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
    //Refresh Command List
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);
        try {
            client.commands.set(command.data.name, command);
            slashcommands.push(command.data.toJSON());     
        } catch {
            client.commands.set(command.name, command);
            
        }
    }
    const rest = new REST({ version: '9' }).setToken(token);
    //Push Slash Commands to Discord API
    (async () => {
        try {
            console.log('Manually started refreshing application (/) commands.');
            client.users.fetch('946377996414107691', false).then((Owner) => {
                Owner.send({ content: '**Started Refreshing Commands**', allowedMentions: { repliedUser: false }})
            });   
            if(IsDev){
                await rest.put(
                    //Dev Client
                    Routes.applicationCommands(BotDevID),
                    { body: slashcommands },
                );
            }else{
                await rest.put(
                    //Global Client
                    Routes.applicationCommands(mainclientId),
                    { body: slashcommands },
                );
            }               
            console.log('Successfully reloaded application (/) commands.');
            client.users.fetch('946377996414107691', false).then((Owner) => {
                Owner.send({ content: '**Successfully Reloaded Commands**', allowedMentions: { repliedUser: false }})
            });
        } catch (error) {
            console.error(error);
        }
    })();
}

//Message Function 
client.on(Events.MessageCreate, message => {
	if (message.author.bot) return;
    if(message.guild){

    }else if (!message.guild){
        //DMs
        const args = message.content.toLowerCase().trim().split(/ +/g);
        //Refresh Command
        if(message.content=='refresh'){
            if(message.guild) return
            if(message.author.id=="946377996414107691"){
                ManualCommandRefresh();
                return
            }
        }
        if (!client.commands.has(args[0])) return;
        try {
            //Database Connection Check
            var con = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            con.connect(async function(err) {
                if (err){
                    console.log('Message Database Check: Cannot connect to database!')
                    console.log(err)
                    if(args[0] == 'confess'){
                        return message.channel.send(':no_entry: Cannot connect to database!  Try again in a few minutes! :no_entry:')   
                    }
                }else{
                    //Send to command handler
                    client.commands.get(args[0]).execute(message, args, client, prefix);
                }
            });
        } catch (error) {
            console.error(error);
            return message.reply(':no_entry: There was an error while executing this command! :no_entry: ');
        }
        
    }
});

//Ready Function
client.once(Events.ClientReady, () => {
    client.user.setActivity(`Starting up... please wait`);
    client.user.setStatus("online");
    console.log(" _____     _ _ ")
    console.log("|     |___|_|_|")
    console.log("| | | | -_| | |")
    console.log("|_|_|_|___|_|_|")
    CommandRefresh();
    console.log("Launched!")
    client.user.setActivity(`${prefix}help | Watching ${client.guilds.cache.size} servers!`);
});

//Slash Command Function
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.guild) return
	if (!interaction.isCommand()) return;
    //Database Login
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
      });
    //Database Check
    con.connect(async function(err) {
        if (err){
            const { commandName } = interaction;
            console.log('Database Check: Cannot connect to database!')
            console.log(err)
            if(commandName == 'confessban' || commandName=='confessunban' || commandName=='confesslogs' || commandName == "confesschannel"){
                return interaction.reply({ content: ':no_entry: Cannot connect to database!  Try again in a few minutes! :no_entry:', allowedMentions: { repliedUser: true }, ephemeral: true })   
            }else{
                if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.ReadMessageHistory) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                    return interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`, ephemeral: true }).catch(() => {
                        return; 
                    })
                }
                if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.ReadMessageHistory) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)){
                    return interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`, ephemeral: true }).catch(() => {
                        return;
                    })
                }      
                const { commandName } = interaction;
                if (!client.commands.has(commandName)) return;
                try {
                    await client.commands.get(commandName).execute(interaction, null, client, prefix);
                } catch (error) {
                    console.error(error);
                    return interaction.reply({ content: ':no_entry: There was an error while executing this command! :no_entry: ', ephemeral: true });
                }
            }

        }else{
            //Query Database Check Block
            var sql = `SELECT COUNT(*) FROM server_data WHERE server_id = ${interaction.guild.id}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                strresult = JSON.stringify(result[0]);
                if(strresult.includes(0)){
                    //Query Update Block
                    var sql = `INSERT INTO server_data (server_id, confession_userbans_ids) VALUES (${interaction.guild.id}, ' ')`;
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(`New Database Entry Created with GuildID: ${interaction.guild.id}`);
                    });
                }
            });
            if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.ReadMessageHistory) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)){
                return interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`, ephemeral: true }).catch(() => {
                    return; 
                })
            }
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.ReadMessageHistory) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)){
                return interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`, ephemeral: true }).catch(() => {
                    return;
                })
            }      
            const { commandName } = interaction;
            if (!client.commands.has(commandName)) return;
            try {
                await client.commands.get(commandName).execute(interaction, null, client, prefix);
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: ':no_entry: There was an error while executing this command! :no_entry: ', ephemeral: true });
            }
        }
    });
});

//Guild Join Funcion
client.on(Events.GuildCreate, guild => {
    client.user.setActivity(`${prefix}help | Helping ${client.guilds.cache.size} servers!`);             
    });
        
    //Guild Leave Function
    client.on(Events.GuildDelete, guild => {
    client.user.setActivity(`${prefix}help | Helping ${client.guilds.cache.size} servers!`); 
    //Database Login
    var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
      });
    
    //Data Deletion 
    con.connect(function(err) {
        if (err){
          console.log('Data Deletion: Cannot connect to database!')
          console.log(err)
        }else{
          //console.log("Connected!");
        }
        //Query Database Deletion Block
        var sql = `DELETE FROM server_data WHERE server_id ='${guild.id}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(`Deleted Database Entry for GuildID: ${guild.id}`)
        });
    });
});

//Error Logging
client.on("warn", function (info) {
    console.log(`Warn: ${info}`);
});
client.on("error", function (error) {
    console.error(
        `Error: ${error}`
    );
})
client.on("debug", function (info) {
    console.log(`Debug: ${info}`);
});
client.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});