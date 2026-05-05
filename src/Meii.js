//Copyright 2026 Oribia. All Rights Reserved
//If you see this, have a great day :3 - OribiaDev

//Bug?
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

//Imports
const { Client, GatewayIntentBits, Partials, Collection, Events, ActivityType, MessageFlags } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const os = require('os');
const { startHealthServer } = require("./health");

//Config Import
const { production_server_ip, tokens, database, settings } = require('./Jsons/config.json');

//Intents
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

//Variables
var token;
var database_url;
var shardID;
var totalShards;
const ip = (Object.values(os.networkInterfaces()).flat().find(iface => iface.family === 'IPv4' && !iface.internal) || {}).address;

//Dev Toggle
var IsDev = null;
if(ip==production_server_ip){
    //Server IP
    IsDev = false
    token = tokens.production_token;
    if(settings.using_docker) { database_url = database.url_docker } else { database_url = database.url }
}else {
    //Any Other IP
    IsDev = true
    token = tokens.dev_token;
    database_url = database.url;
}

//MongoDB Client
const mongoClient = new MongoClient(database_url)

//Bot Login
client.login(token)

//Command Register 
function CommandRefresh(){
    //Global Commands
    const slashcommands = [];
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./src/Commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);
        try {
            client.commands.set(command.data.name, command);
            slashcommands.push(command.data.toJSON());     
        } catch {
            client.commands.set(command.name, command); 
        }
    }
    //Admin Only Commands
    const adminslashcommands = [];
    const admincommandFiles = fs.readdirSync('./src/AdminCommands').filter(file => file.endsWith('.js'));
    for (const file of admincommandFiles) {
        const command = require(`./AdminCommands/${file}`);
        try {
            client.commands.set(command.data.name, command);
            adminslashcommands.push(command.data.toJSON());     
        } catch {
            client.commands.set(command.name, command); 
        }
    }
    const rest = new REST({ version: '10' }).setToken(token);
    //Push Slash Commands to Discord API
    (async () => {
        try {
            if(IsDev){
                //Dev
                //Admin Commands
                await rest.put(
                     Routes.applicationGuildCommands(tokens.dev_id, '1000504347421057054'),
                    { body: adminslashcommands },
                );
                //Global Commands
                await rest.put(
                    Routes.applicationCommands(tokens.dev_id),
                    { body: slashcommands },
                );
            }else{
                //Production
                //Admin Commands
                await rest.put(
                     Routes.applicationGuildCommands(tokens.production_id, '1041867319812562955'),
                    { body: adminslashcommands },
                );
                //Global Commands
                await rest.put(
                    Routes.applicationCommands(tokens.production_id),
                    { body: slashcommands },
                );
            }
        } catch (error) {
            console.error(error);
        }
    })();
}

//Activity Refresher
async function activityRefresh(){
    client.user.setActivity(`/help | meii.bot`, { type: ActivityType.Listening })
    setTimeout(() => {
        //Refresh every 6 hours
        activityRefresh();
      }, 60000 * 360);
}

//Message Event Handler
process.on("message", message => {
    if (!message.type) return false;
    if (message.type == "shardId") {
        shardID = message.data.shardId;
    };
    if (message.type == "shardTotal") {
        totalShards = message.data.shardTotal
    };
});

//Ready Function
client.once(Events.ClientReady, async () => {
    //Startup
    client.user.setStatus('dnd');
    client.user.setActivity(`Starting up... please wait`);
    //Health Server
    const shardId = client.shard.ids[0];
    const port = 3000 + shardId; // each shard gets its own port
    await startHealthServer(shardId, port);
    //Database Connect
    await mongoClient.connect();
    //Startup Functions
    CommandRefresh();
    await activityRefresh();
    //Startup Completed
    client.user.setStatus("online");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Successfully started shard ${shardID}.`)
});

//Interaction Handler
client.on(Events.InteractionCreate, async interaction => {
    //Database Variables 
    const db = mongoClient.db(database.name)
    var databaseCollections = {
        server_data: db.collection(database.server_collection_name),
        bot_data: db.collection(database.bot_collection_name),
        confession_data: db.collection(database.confession_collection_name)  
    };
    var shardCollections = {
        shardID: shardID,
        totalShards: totalShards 
    };
    //Command Handler
    if (!interaction.isCommand()) return;
    if(!interaction.guild) return interaction.reply({content:"Im sorry, this command can only be ran in a server.", flags: MessageFlags.Ephemeral  })
    //Existing Database Command Handler       
    const { commandName } = interaction;
    if (!client.commands.has(commandName)) return;
    try {
        await client.commands.get(commandName).execute(interaction, db, databaseCollections, client, shardCollections);
    } catch (e) {
        console.error(e);
        return await interaction.reply({ content: 'There was an error while executing this command. Please try again later or contact support.', flags: MessageFlags.Ephemeral  });
    }   
});

//Guild Join Function
client.on(Events.GuildCreate, async guild => {
    //Database Variables
    const db = mongoClient.db(database.name)
    const bot_data = db.collection(database.bot_collection_name)
    //Server Ban Check
    const botDocument = await bot_data.findOne({ type: 'prod' });
    const serverBansArray = botDocument.server_bans || [] 
    let index = serverBansArray.indexOf(`${guild.id}`);
    //Leaves server if banned
    if (index !== -1) return await guild.leave();
});

//Guild Leave Function
client.on(Events.GuildDelete, async guild => {
    //Database Variables
    const db = mongoClient.db(database.name)
    const server_data = db.collection(database.server_collection_name)
    //Data Deletion 
    const guildDocument = await server_data.findOne({ server_id: guild.id });
    if(guildDocument==undefined) return
    await server_data.deleteOne({ _id: guildDocument._id });
    console.log(`(Shard ${shardID}): Deleted Database Document for GuildID: ${guild.id}`)
});

//Error Logging
client.on("warn", function (info) {
    console.log(`Warn (Shard ${shardID}): ${info}`);
});

client.on("error", function (error) {
    if(error.code === 10062 || error.code === 40060 ) return;
    console.error(
        `Error (Shard ${shardID}): ${error}`
    );
})

