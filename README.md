<p align="center">
 <img src="https://meiibot.xyz/img/Logos/MeiiRoundedPurpleBorder.png" width="200" alt="Meii Logo">
</p>

## Meii
A powerful multipurpose, gif emote, confession + logging, and moderation Discord bot. 

## Description

Meii has an in-depth and simple anonymous confession system with logging. It is very well-polished and has many commands to keep you entertained while keeping your server safe. .

## Getting Started

### Dependencies

* Node-JS
* MongoDB
* Docker (Optional)
* Various node-js packages (see in packages file)

### Inviting the bot

* Invite the bot to your discord using this [invite](https://discord.com/oauth2/authorize?client_id=1082401009206308945&permissions=2147576838&scope=applications.commands%20bot)

### Initializing Source Code

* Install [Node-JS](https://nodejs.org/en/)
* Download the source code either with git or downloading it at the top right
* Extract it, open the folder in the command prompt
* type ```npm install``` to install the necessary packages
* Install and setup a [MongoDB](https://www.mongodb.com/try/download/community) database using Atlas or MongoDB Server
* Open the config file located in /src/Jsons/ and fill out the values. Its pretty self explanatory. Make sure to fill out the dev bot values as it uses a secondary bot when developing so the main bot doesnt have to be offline.
* type ```node .``` to start the bot.

### Using Docker

* Make sure you have [docker](https://www.docker.com/products/docker-desktop/) installed 
* Install and setup a [MongoDB](https://www.mongodb.com/try/download/community) database using Atlas, MongoDB Server, or docker
* Download the source code either with git or downloading it at the top right
* Extract it
* Open the config file located in /src/Jsons/ and fill out the values. Its pretty self explanatory. Set using_docker to true and make sure to set the docker ip for your mongodb database (since docker has its own IP system). If you're not using docker then make sure to fill out every other value as its also uses a secondary bot as the 'dev bot' so the main bot can stay up during development.
* Then build the docker image and upload it to your docker host
* Note: If you upload the docker image to dockerhub all your tokens in the config file will be uploaded too, I suggest making the image private, or not uploading it at all

## Help

* Run the command ```/help``` in a discord text channel to see the list of commands
* If its a source code related issue, contact ```oribia.dev``` on discord 

## Reporting Bugs

* If you find a bug within Meii's source code or while using Meii, please report it in the issues tab or make a pull request

## Authors

* [@Oribia_Dev](https://oribia.dev)

## License

All Rights Reserved unless otherwise explicitly stated.

YOU MAY NOT COPY, OR USE THIS PROJECT FOR ANYTHING OTHER THAN EDUCATIONAL PURPOSES 
