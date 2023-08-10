//Copyright 2023 Oribia. All Rights Reserved
//If you see this, have a great day :3 - OribiaDev

//Imports
const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, Events, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { main_token, dev_token, host, user, password, database, top_token } = require('./Jsons/config.json');
const { AutoPoster } = require('topgg-autoposter')
const mysql = require('mysql');
const fs = require('fs');

//Intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });

//Variables
const prefix = '/'
const BotDevID = '1082402034759766016'
const mainclientId = '1082401009206308945' 

//Dev Toggle
const IsDev = true

//Token Changer
var token;
if(IsDev){
    token = dev_token;
}else{
    token = main_token;
}

//Bot Login
client.login(token)

//Top.GG
if(!IsDev){
    //Poster Var
    const poster = AutoPoster(top_token, client)
    //Console Log Posted
    poster.on('posted', (stats) => { // ran when succesfully posted
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
    })
}

//Database Login (Passed through database commands)
var pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    connectionLimit: 30,
});

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

//Message Function 
client.on(Events.MessageCreate, message => {
	if (message.author.bot) return;
    if(message.guild) return
    if(message.content.toLocaleLowerCase()=="confess"){
        //DMs
        const args = message.content.toLowerCase().trim().split(/ +/g);
        if (!client.commands.has(args[0])) return;
        try {
            //Send to command handler
            client.commands.get('confession_command_dms').execute(message, args, client, prefix);
        } catch (error) {
            console.error(error);
            return message.channel.send('\`There was an error while executing this command\`');
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
    client.user.setActivity(`${prefix}help`, { type: ActivityType.Listening })
});

//Slash Command Function
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
    if(!interaction.guild) return interaction.reply({content:"\`Im sorry, this command can only be ran in a server!\`", ephemeral: true })
    //Query Database Check Block
    var sql = `SELECT COUNT(*) FROM server_data WHERE server_id = ${interaction.guild.id}`;
    pool.query(sql, async function (err, result) {
        if (err) throw err;
        strresult = JSON.stringify(result[0]);
        if(strresult.includes(0)){
            const { commandName } = interaction;
            //Database Create Only For Database Commands
            if(commandName=="set" || commandName=="confessban" || commandName=="confessunban" || commandName=="checklogs"){
                //Query Update Block
                var sql = `INSERT INTO server_data (server_id, confession_userbans_ids) VALUES (${interaction.guild.id}, ' ')`;
                pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    console.log(`New Database Entry Created with GuildID: ${interaction.guild.id}`);
                    //Permissions Check
                    if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks))return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return;})
                    if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return;})
                    //New Database Command Handler      
                    const { commandName } = interaction;
                    if (!client.commands.has(commandName)) return;
                    try {
                        await client.commands.get(commandName).execute(interaction, pool, null, client, prefix);
                    } catch (error) {
                        console.error(error);
                        return await interaction.reply({ content: '\`There was an error while executing this command\`', ephemeral: true });
                    }
                });
            }else{
                //Permissions Check
                if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return; })  
                if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)){return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return;})}
                //No Database Command Handler      
                const { commandName } = interaction;
                if (!client.commands.has(commandName)) return;
                try {
                    await client.commands.get(commandName).execute(interaction, pool, null, client, prefix);
                } catch (error) {
                    console.error(error);
                    return await interaction.reply({ content: '\`There was an error while executing this command\`', ephemeral: true });
                }
            }
        }else{
            //Permissions Check
            if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return; })
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need \`Send Messages\`, and \`Embed Links\``, ephemeral: true }).catch(() => {return;})
            //Existing Database Command Handler      
            const { commandName } = interaction;
            if (!client.commands.has(commandName)) return;
            try {
                await client.commands.get(commandName).execute(interaction, pool, null, client, prefix);
            } catch (error) {
                console.error(error);
                return await interaction.reply({ content: '\`There was an error while executing this command\`', ephemeral: true });
            }                   
        }
    });
});

//Guild Leave Function
client.on(Events.GuildDelete, guild => {
    //Data Deletion 
    var sql = `SELECT COUNT(*) FROM server_data WHERE server_id = ${guild.id}`;
    pool.query(sql, function (err, result) {
        if (err) throw err;
        strresult = JSON.stringify(result[0]);
        if(strresult.includes(1)){
            var sql = `DELETE FROM server_data WHERE server_id ='${guild.id}'`;
            pool.query(sql, function (err, result) {
                if (err) throw err;
                console.log(`Deleted Database Entry for GuildID: ${guild.id}`)
            });
        }    
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
client.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
