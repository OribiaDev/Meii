<p align="center">
 <img src="https://meiibot.xyz/Img/MeiiLogoRoundedPurpleNew.png" width="200" alt="Meii Logo">
</p>

## Meii
A powerful multipurpose, gif emote, confession + logging, and moderation Discord bot. 

## Description

Meii has an in-depth and straightforward anonymous confession system with logging. It is very well-polished and has many commands to keep you entertained while keeping your server safe. 

## Getting Started

### Dependencies

* Node-JS
* MySQL
* Various node-js packages (see in packages file)

### Inviting the bot

* Invite the bot to your discord using this [invite](https://discord.com/oauth2/authorize?client_id=1082401009206308945&permissions=2147576838&scope=applications.commands%20bot)

### Initializing Source Code

* Install [Node-JS](https://nodejs.org/en/)
* Install the source code either with git or downloading it at the top right
* Extract it, open the folder in the command prompt
* type ```npm install``` to install the necessary packages
* setup MySQL, make a database with a table named ```sever_data``` with columns (server_id(varchar), confession_channel_ids(varchar), confession_modlog_ids(varchar) and confession_userban_ids(longtext)) 
* insert the various values in the config file (MySQL, Tokens, and IPs)
* and type ```node .``` to start the bot!

## Help

* Run the command ```/help``` in a discord text channel to see the list of commands

## Authors

* [@Oribia_Dev](https://twitter.com/Oribia_Dev)

## License

All Rights Reserved unless otherwise explicitly stated.

YOU MAY NOT COPY, OR USE THIS PROJECT FOR ANYTHING OTHER THAN EDUCATIONAL PURPOSES 
