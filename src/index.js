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
    //Poster Var
    const poster = AutoPoster(tokens.top_gg_token, client)
    poster.on('posted', (stats) => { // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers.`)
    })
}

//Auto Database Purge (Ran only on startup)
async function DatabasePurge(){
    console.log('Attempting to purge the database..')
    if(IsDev) return console.log("Cannot do database purge in Dev mode! \n")
    const db = mongoClient.db(database.name)
    const server_data = db.collection(database.collection_name)
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
            console.log('Successfully reloaded application (/) commands. \n---- ');
        } catch (error) {
            console.error(error);
        }
    })();
    setTimeout(() => {
        //Refresh every 6 hours
        CommandRefresh();
      }, 60000 * 360);
}

//Ready Function
client.once(Events.ClientReady, async () => {
    client.user.setActivity(`Starting up... please wait`);
    client.user.setStatus("online");
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
    await DatabasePurge()
    await console.log("Launched!")
    await client.user.setActivity(`${prefix}help`, { type: ActivityType.Listening })
});

//Slash Command Function
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
    if(!interaction.guild) return interaction.reply({content:"\`Im sorry, this command can only be ran in a server!\`", ephemeral: true })
    //Database Variables
    const db = mongoClient.db(database.name)
    const server_data = db.collection(database.collection_name)
    //Permissions Check
    if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return; })
    if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return;})
    //Existing Database Command Handler      
    const { commandName } = interaction;
    if (!client.commands.has(commandName)) return;
    try {
        await client.commands.get(commandName).execute(interaction, db, server_data, client, prefix);
    } catch (error) {
        console.error(error);
        return await interaction.reply({ content: '\`There was an error while executing this command\`', ephemeral: true });
    }  
});

//Guild Leave Function
client.on(Events.GuildDelete, async guild => {
    //Database Variables
    const db = mongoClient.db(database.name)
    const server_data = db.collection(database.collection_name)
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
