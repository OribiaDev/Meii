//Copyright 2024 Oribia. All Rights Reserved
//If you see this, meow :3 - OribiaDev

//Imports
const { ShardingManager } = require('discord.js');
const { MongoClient } = require('mongodb');
var ip = require("ip");
const { AutoPoster } = require('topgg-autoposter')
const schedule = require('node-schedule');

//Config Import
const { production_server_ip, tokens, database, settings } = require('./Jsons/config.json');

//Variables
var database_url;
var token;

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

//Mongo Client
const mongoClient = new MongoClient(database_url)

//Confession Database Purge
async function ConfessionDatabasePurge(){
    console.log('Attempting to purge the confession database..')
    //Database Variables
    const db = mongoClient.db(database.name)
    const confession_data = db.collection(database.confession_collection_name)
    //Calculate the date 30 days ago
    const desiredDate = new Date();
    desiredDate.setDate(desiredDate.getDate() - 30);
    //Delete the documents
    const result = await confession_data.deleteMany({ document_date: { $lt: desiredDate } });
    console.log(`Successfully purged (${result.deletedCount}) confession document(s).`)
}

//Sharding Manager 
const manager = new ShardingManager('./src/Meii.js', { 
    token: token,  
    totalShards: 'auto',
    respawn: true
});

//Top.GG
if(!IsDev){
    //Poster Var
    const poster = AutoPoster(tokens.top_gg_token, manager)
    poster.on('posted', (stats) => { // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers.`)
    })
    poster.on('error', (err) => { 
        return console.log('Top.GG API Error')
    }) 
}

//Shard Create Event
let shardCounter = 0;
manager.on('shardCreate', shard => {
    console.log(`Starting shard ${shard.id}..`)
    //Shard Ready Event
    const totalShards = manager.totalShards;
    shard.on('ready', async () => {
        //Send Shard Info
        shard.send({type: "shardId", data: {shardId: shard.id}});
        shard.send({type: "shardTotal", data: {shardTotal: totalShards}});
        //Shards Fully Launched
        shardCounter++;
        if(shardCounter===totalShards){
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("\n")
            console.log("Launched!")
            console.log("----")
        }
    });
});

//Meii Startup
async function MeiiStartup(){
    //Meii Logos
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
    //Database Connect
    console.log('Attempting to connect to the database...' );
    await mongoClient.connect();
    console.log('Connected successfully to the database.\n');
    schedule.scheduleJob('0 0 * * *', () => { ConfessionDatabasePurge(); }) // Ran everyday at midnight
    console.log('Successfully started the confession purge schedule.')
    console.log('\nAttempting to start shards...')
    manager.spawn();
}

//Start Startup Function
MeiiStartup();