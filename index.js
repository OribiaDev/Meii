//Imports
const Discord = require('discord.js')
const bot = new Discord.Client();
const prefix = "m!"
const fs = require("fs");

//Jsons
const config = require('./Jsons/config.json')

//Bot Login
bot.login(config.token);

//Ready Function
bot.on('ready', () => {
    bot.user.setActivity(`Starting up... please wait`);
    bot.user.setStatus("online");
    console.log(" _____ _ _       ")
    console.log("|     |_| |_ _ _ ")
    console.log("| | | | | '_| | |")
    console.log("|_|_|_|_|_,_|___|")
    console.log("                 ")
    console.log("Launched!")
    bot.user.setActivity(`${prefix}help | Exposing ${bot.guilds.cache.size} servers!`);
});

//Message Function
bot.on('message', async (message) => {
    if(message.author.bot) return
    if(message.guild === null) return;
    if(message.author.bot) return;
    if(message.author == null){
        return;
    }

    //Json Parsing

    //Args
    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);


    //Commands

        //Help Commands
        if(message.content==`${prefix}help`){
            let helpmenu = new Discord.MessageEmbed()
            .setTitle("**Miku Command List**")
            .setColor("ff9aa2")
            .setDescription(`:scream: **Confessions** \n ${prefix}help confessions \n\n :tools: **Moderation** \n ${prefix}help moderation \n\n :wrench: **Utility** \n ${prefix}help utility`)
            message.channel.send(helpmenu)
        }
        if(message.content==`${prefix}help confessions`){
            let helpmenuconfessions = new Discord.MessageEmbed()
            .setTitle("**Confession Commands**")
            .setColor("#ff9aa2")
            .setDescription(``)
            .setFooter("[something] = required | (something) = optional ")
            message.channel.send(helpmenuconfessions)
        }
        if(message.content==`${prefix}help moderation`){
            let helpmenumoderation = new Discord.MessageEmbed()
            .setTitle("**Moderation Commands**")
            .setColor("#ff9aa2")
            .setDescription(``)
            .setFooter("[something] = required | (something) = optional ")
            message.channel.send(helpmenumoderation)
        }
        if(message.content==`${prefix}help utility`){
            let helpmenuutility = new Discord.MessageEmbed()
            .setTitle("**Utility Commands**")
            .setColor("#ff9aa2")
            .setDescription(`:ping_pong: **${prefix}ping**: Tells the bots ping \n\n :information_source: **${prefix}info**: Shows the bots info`)
            .setFooter("[something] = required | (something) = optional ")
            message.channel.send(helpmenuutility)
        }

        //Confess Commands

        //Moderation Commands

        //Utility Commands
        if(message.content==prefix+"ping"){
            const m = await message.channel.send("Ping?");
            m.edit(`:ping_pong: Pong! | Latency is ${m.createdTimestamp - message.createdTimestamp}ms | API latency is ${bot.ws.ping}ms`);
        }
        
        //Misc
        if(message.content==prefix+"info"){
            let infoemb = new Discord.MessageEmbed()
            .setColor("#ffdac1")
            .setTitle(" **Info:**")
            .setDescription(`Prefix: **${prefix}** \n Servers: **${bot.guilds.cache.size}** \n Ping: **${bot.ws.ping}ms** \n Date Created: **11/23/2020** \n Author: **Thermionic#7001** `)
            message.channel.send(infoemb)
        }
});

//Guild Join Funcion
bot.on("guildCreate", guild => {
bot.user.setActivity(`${prefix}help | Exposing ${bot.guilds.cache.size} servers!`);             
});
    
//Guild Leave Function
bot.on("guildDelete", guild => {
bot.user.setActivity(`${prefix}help | Exposing ${bot.guilds.cache.size} servers!`); 
});
    
//Error Function
bot.on('error', e => {
    console.log(e);
});
