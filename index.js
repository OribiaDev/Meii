//Imports
const { Client, Collection, Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./Jsons/config.json');
const fs = require('fs');

//Intents
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES" ], partials: ["CHANNEL"] });

//Variables
const prefix = 'm;'

//Bot Login
client.login(token);

//Command Handler 
function CommandRefresh(){
    const slashcommands = [];
    client.commands = new Collection();
    const testclientId = '899109974083518514';
    const mainclientId = '899110520202874960'
    const guildId = '897989560502472714';  
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
            console.log('Started refreshing application (/) commands.');
    
            await rest.put(
                //Testing
                //Routes.applicationGuildCommands(testclientId, guildId),
                //{ body: slashcommands }
                //Global
                Routes.applicationCommands(mainclientId),
                { body: slashcommands },
            );
    
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
    const testclientId = '890816497604247552';
    const mainclientId = '890816497604247552'
    const guildId = '890814791772405760';  
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
            client.users.fetch('481607837412360203', false).then((Owner) => {
                Owner.send({ content: '**Started Refreshing Commands**', allowedMentions: { repliedUser: false }})
            });
    
            await rest.put(
                //Testing
                //Routes.applicationGuildCommands(testclientId, guildId),
                //{ body: slashcommands }
                //Global
                Routes.applicationCommands(mainclientId),
                { body: slashcommands },
            );
                
            console.log('Successfully reloaded application (/) commands.');
            client.users.fetch('481607837412360203', false).then((Owner) => {
                Owner.send({ content: '**Successfully Reloaded Commands**', allowedMentions: { repliedUser: false }})
            });
        } catch (error) {
            console.error(error);
        }
    })();
}


//Ready Function
client.once('ready', () => {
    client.user.setActivity(`Starting up... please wait`);
    client.user.setStatus("online");
    console.log(" _____ _ _       ")
    console.log("|     |_| |_ _ _ ")
    console.log("| | | | | '_| | |")
    console.log("|_|_|_|_|_,_|___|")
    console.log("                 ")
    CommandRefresh();
    console.log("Launched!")
    client.user.setActivity(`${prefix}help | Watching ${client.guilds.cache.size} servers!`);
});

//Message Function 
client.on('messageCreate', message => {
	if (message.author.bot) return;
    if(message.guild){
        //Guild
        //Permission Check
        if(message.content.startsWith(prefix)){
            if(!message.channel.permissionsFor(client.user).has(Permissions.FLAGS.SEND_MESSAGES) || !message.channel.permissionsFor(client.user).has(Permissions.FLAGS.READ_MESSAGE_HISTORY) || !message.channel.permissionsFor(client.user).has(Permissions.FLAGS.EMBED_LINKS)){
                return message.author.send(`I'm sorry, I do not have enough permissions to send messages in ${message.channel}, in **${message.guild}**! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`).catch(() => {
                    return;
                })
            }
            if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) || !message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)){
                return message.author.send(`I'm sorry, I do not have enough permissions to send messages in **${message.guild}**! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`).catch(() => {
                    return;
                })
            }       
        }
        if(!message.content.includes('m;')) return
        const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
    
        if (!client.commands.has(command)) return;   
        try {
            client.commands.get(command).execute(message, args, client, prefix);
        } catch (error) {
            console.error(error);
            return message.reply(':no_entry: There was an error while executing this command! :no_entry: ');
        }
    }else if (!message.guild){
        //DMs
        const args = message.content.toLowerCase().trim().split(/ +/g);
        //Refresh Command
        if(message.content=='refresh'){
            if(message.guild) return
            if(!message.author.id=='481607837412360203') return
            ManualCommandRefresh();
        }
        if (!client.commands.has(args[0])) return;
        try {
            client.commands.get(args[0]).execute(message, args, client);
        } catch (error) {
            console.error(error);
            return message.reply(':no_entry: There was an error while executing this command! :no_entry: ');
        }
        
    }
});



//Slash Command Function
client.on('interactionCreate', async interaction => {
    if(!interaction.guild) return
	if (!interaction.isCommand()) return;
    if(!interaction.channel.permissionsFor(client.user).has(Permissions.FLAGS.SEND_MESSAGES) || !interaction.channel.permissionsFor(client.user).has(Permissions.FLAGS.READ_MESSAGE_HISTORY) || !interaction.channel.permissionsFor(client.user).has(Permissions.FLAGS.EMBED_LINKS)){
        return interaction.reply({ content: `I'm sorry, I do not have enough permissions to send messages! \n I need **Send Messages**, **Read Message History**, and **Embed Links**`, ephemeral: true }).catch(() => {
            return; 
        })
    }
    if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) || !interaction.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY) || !interaction.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)){
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
});

//Guild Join Funcion
client.on("guildCreate", guild => {
    client.user.setActivity(`${prefix}help | Helping ${client.guilds.cache.size} servers!`);             
    });
        
    //Guild Leave Function
    client.on("guildDelete", guild => {
    client.user.setActivity(`${prefix}help | Helping ${client.guilds.cache.size} servers!`); 
    
    //Data Deletion 
    let confessionchannels = JSON.parse(fs.readFileSync("./Jsons/Confession/ConfessionChannels.json", "utf8"));
    let confessionmodlogs = JSON.parse(fs.readFileSync("./Jsons/Confession/ConfessionModLog.json", "utf8"));
    let confessionbans = JSON.parse(fs.readFileSync("./Jsons/Confession/ConfessionBans.json", "utf8"));

    if(confessionchannels[guild.id]){
        confessionchannels[guild.id] = {
            confessionchannels: ""
        }
        fs.writeFile("./Jsons/Confession/ConfessionChannels.json", JSON.stringify(confessionchannels), (err) => {
            if (err) console.log(err)
        });
    }
    if(confessionmodlogs[guild.id]){
        confessionmodlogs[guild.id] = {
            confessionmodlogs: ""
        }
        fs.writeFile("./Jsons/Confession/ConfessionModLog.json", JSON.stringify(confessionmodlogs), (err) => {
            if (err) console.log(err)
        });
    }
    if(confessionbans[guild.id]){
        confessionbans[guild.id] = {
            confessionbans: ""
        }
        fs.writeFile("./Jsons/Confession/ConfessionBans.json", JSON.stringify(confessionbans), (err) => {
            if (err) console.log(err)
        }); 
    }   
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