//Copyright 2023 Oribia. All Rights Reserved
//If you see this, have a great day :3 - OribiaDev

//Imports
const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, Events, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MongoClient } = require('mongodb');
const { AutoPoster } = require('topgg-autoposter')
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

//Top.GG
if(!IsDev){
    try{
        //Poster Var
        const poster = AutoPoster(tokens.top_gg_token, client)
        poster.on('posted', (stats) => { // ran when succesfully posted
            console.log(`Posted stats to Top.gg | ${stats.serverCount} servers.`)
        })
    }catch{
        return console.log('Top.GG API Error')
    }
}

//Auto Database Purge (Ran only on startup)
async function DatabasePurge(){
    console.log('Attempting to purge the database..')
    if(IsDev) return console.log("Cannot do database purge in Dev mode! \n")
    const db = mongoClient.db(database.name)
    const server_data = db.collection(database.server_collection_name)
    let serverCounter = 0;
    const guildDocs = await server_data.find().toArray();
    const guilds = client.guilds.cache.map(guild => guild.id);
    for await (const guildDoc of guildDocs) {
        if (!guilds.includes(guildDoc.server_id)) {
            await server_data.deleteOne({ server_id: guildDoc.server_id });
            serverCounter++;
        }
    }
    await console.log(`Successfully purged (${serverCounter}) document(s). \n`)
}

//Command Handler 
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
            console.log('Attempting to refresh application (/) commands...');
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
            console.log('Successfully reloaded application (/) commands.');
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
    await client.user.setActivity(`${prefix}help`, { type: ActivityType.Listening })
    setTimeout(() => {
        //Refresh every 6 hours
        activityRefresh();
      }, 60000 * 360);
}

//Ready Function
client.once(Events.ClientReady, async () => {
    client.user.setStatus('dnd');
    client.user.setActivity(`Starting up... please wait`);
    if(!IsDev){
        //Not Dev
        console.log(" _____     _ _ ")
        console.log("|     |___|_|_|")
        console.log("| | | | -_| | |")
        console.log("|_|_|_|___|_|_|")
    }else{
        //Dev
        console.log(" _____     _ _ ____          ")
        console.log("|     |___|_|_|    \ ___ _ _ ")
        console.log("| | | | -_| | |  |  | -_| | |")
        console.log("|_|_|_|___|_|_|____/|___|\_/ ")
    }
    console.log('Attempting to connect to the database...');
    await mongoClient.connect();
    console.log('Connected successfully to the database. \n');
    await CommandRefresh();
    await DatabasePurge();
    await activityRefresh();
    await console.log("Launched!")
    client.user.setStatus("online");
    console.log("----")
});

//Slash Command Function
client.on(Events.InteractionCreate, async interaction => {
    //Check If User Banned
    const db = mongoClient.db(database.name)
    const bot_data = db.collection(database.bot_collection_name) 
    const botDocument = await bot_data.find({ type: 'prod' }).toArray();
    const userBansArray = botDocument[0].user_bans || [] 
    let index = userBansArray.indexOf(`${interaction.user.id}`);
    if (index !== -1) return await interaction.reply({content:"I'm sorry, you are banned from using Meii.\n\nIf you think this is a mistake, please join the [support server](https://discord.gg/E23tPPTwSc).", ephemeral: true })
    if(interaction.isButton() && interaction.customId.includes("customize")){
        //Database Vars
        const db = mongoClient.db(database.name)
        const server_data = db.collection(database.server_collection_name)  
        //Customize Button Handler (Modal) 
        await client.commands.get('customize').handleButton(interaction, db, server_data); 
    }else{
        if (!interaction.isCommand()) return;
        if(!interaction.guild) return interaction.reply({content:"Im sorry, this command can only be ran in a server!", ephemeral: true })
        //Database Variables
        const db = mongoClient.db(database.name)
        const server_data = db.collection(database.server_collection_name)  
        const bot_data = db.collection(database.bot_collection_name)  
        //Existing Database Command Handler      
        const { commandName } = interaction;
        if (!client.commands.has(commandName)) return;
        try {
            await client.commands.get(commandName).execute(interaction, db, server_data, bot_data, client, prefix);
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error while executing this command. Please try again later.', ephemeral: true });
        }  
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
    console.log(`Deleted Database Document for GuildID: ${guild.id}`)
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

client.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
