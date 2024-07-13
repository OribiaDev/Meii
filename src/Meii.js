//Copyright 2024 Oribia. All Rights Reserved
//If you see this, have a great day :3 - OribiaDev

//Imports
const { Client, GatewayIntentBits, Partials, Collection, Events, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MongoClient } = require('mongodb');
const fs = require('fs');
var ip = require("ip");

//Config Import
const { production_server_ip, tokens, database, settings } = require('./Jsons/config.json');

//Intents
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

//Variables
const prefix = '/'
var token;
var database_url;
var shardID;
var totalShards;

//Dev Toggle
var IsDev = null;
if(ip.address()==production_server_ip){
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
    const slashcommands = [];
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./src/Commands').filter(file => file.endsWith('.js'));
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
            if(IsDev){
                await rest.put(
                    //Dev Client
                    Routes.applicationCommands(tokens.dev_id),
                    { body: slashcommands },
                );
            }else{
                await rest.put(
                    //Global Client
                    Routes.applicationCommands(tokens.production_id),
                    { body: slashcommands },
                );
            }
        } catch (error) {
            console.error(error);
        }
    })();
    setTimeout(() => {
        //Refresh every 6 hours
        CommandRefresh();
      }, 60000 * 360);
}


//Activity Refresher
async function activityRefresh(){
    client.user.setActivity(`${prefix}help | meiibot.xyz`, { type: ActivityType.Listening })
    setTimeout(() => {
        //Refresh every 6 hours
        activityRefresh();
      }, 60000 * 360);
}

//Ready Function
client.once(Events.ClientReady, async () => {
    //Startup
    client.user.setStatus('dnd');
    client.user.setActivity(`Starting up... please wait`);
    //Database Connect
    await mongoClient.connect();
    //Startup Functions
    CommandRefresh();
    await activityRefresh();
    //Startup Completed
    client.user.setStatus("online");
    console.log(`Successfully started shard ${shardID}.`)
});

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
    //Check If User Banned
    const botDocument = await databaseCollections.bot_data.find({ type: 'prod' }).toArray();
    const userBansArray = botDocument[0].user_bans || [] 
    let index = userBansArray.indexOf(`${interaction.user.id}`);
    if (index !== -1) return await interaction.reply({content:"I'm sorry, you are banned from using Meii.\n\nIf you think this is a mistake, please join the [support server](https://discord.gg/E23tPPTwSc).", ephemeral: true })
    //Button Handler
    if(interaction.isButton()){ 
        try{
            await client.commands.get(interaction.message.interaction.commandName).handleButton(interaction, db, databaseCollections); 
        }catch(e){
            console.error(e)
            return await interaction.reply({ content: 'There was an error while executing this button. Please try again later.', ephemeral: true });
        }
    }
    //Command Handler
    if (!interaction.isCommand()) return;
    if(!interaction.guild) return interaction.reply({content:"Im sorry, this command can only be ran in a server!", ephemeral: true })
    //Existing Database Command Handler       
    const { commandName } = interaction;
    if (!client.commands.has(commandName)) return;
    try {
        await client.commands.get(commandName).execute(interaction, db, databaseCollections, client, shardCollections, prefix);
    } catch (e) {
        console.error(e);
        return await interaction.reply({ content: 'There was an error while executing this command. Please try again later.', ephemeral: true });
    }   
});

//Guild Join Function
client.on(Events.GuildCreate, async guild => {
    //Database Variables
    const db = mongoClient.db(database.name)
    const bot_data = db.collection(database.bot_collection_name)
    //Server Ban Check
    const botDocument = await bot_data.find({ type: 'prod' }).toArray();
    const serverBansArray = botDocument[0].server_bans || [] 
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
    const guildDocument = await server_data.find({ server_id: guild.id }).toArray();
    if(guildDocument[0]==undefined) return
    await server_data.deleteOne({ _id: guildDocument[0]._id });
    console.log(`(Shard ${shardID}): Deleted Database Document for GuildID: ${guild.id}`)
});

//Error Logging
client.on("warn", function (info) {
    console.log(`Warn (Shard ${shardID}): ${info}`);
});

client.on("error", function (error) {
    console.error(
        `Error (Shard ${shardID}): ${error}`
    );
})

client.on('unhandledRejection', error => {
	console.error(`Unhandled promise rejection (Shard ${shardID}): ${error}`);
});
