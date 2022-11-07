const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
var randomHexColor = require('random-hex-color')
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessban')
		.setDescription('Ban a user from confessions!')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to ban from confessions!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
        let confessionbans = JSON.parse(fs.readFileSync("./Jsons/Confession/ConfessionBans.json", "utf8"));
        if(!confessionbans[interaction.guild.id]){
            confessionbans[interaction.guild.id] = {
                confessionbans: ""
            }
        }       
        let confessbans = confessionbans[interaction.guild.id].confessionbans
		if(interaction.content==undefined){
			//Interaction
            if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply("You cannot use this command!")
            let bUser = interaction.options.getMember('user');
            if(!bUser) return interaction.reply("Cant find user! please mention the user in the command!");
            if(confessbans.includes(bUser.id)) return interaction.reply("This user is already banned from confessions!")
            confessionbans[interaction.guild.id] = {
                confessionbans: confessbans + String(bUser.id)
            };
            fs.writeFile("./Jsons/Confession/ConfessionBans.json", JSON.stringify(confessionbans), (err) => {
                if (err) console.log(err)
            });   
            let ConfessBanned = new MessageEmbed()
            .setTitle(`**Confession: User Banned**`)
            .setColor("#FF0000")
            .setDescription(`${bUser} (${bUser.id}) has been banned from using confessions on ${interaction.guild.name}!`)
            .setFooter("To unban this user, do 'm;confessunban'")
            interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
            return
		}else{
			//Message
            if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply("You cannot use this command!")
            let bUser = interaction.mentions.users.first()
            if(!bUser) return interaction.reply("Cant find user! please mention the user in the command!");
            if(confessbans.includes(bUser.id)) return interaction.reply("This user is already banned from confessions!")
            confessionbans[interaction.guild.id] = {
                confessionbans: confessbans + String(bUser.id)
            };
            fs.writeFile("./Jsons/Confession/ConfessionBans.json", JSON.stringify(confessionbans), (err) => {
                if (err) console.log(err)
            });   
            let ConfessBanned = new MessageEmbed()
            .setTitle(`**Confession: User Banned**`)
            .setColor("#FF0000")
            .setDescription(`${bUser} (${bUser.id}) has been banned from using confessions on ${interaction.guild.name}!`)
            .setFooter("To unban this user, do 'm;confessunban'")
            interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
            return
		}
	},
};