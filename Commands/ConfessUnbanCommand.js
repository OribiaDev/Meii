const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js')
var randomHexColor = require('random-hex-color')
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessunban')
		.setDescription('Unban a user from confessions!')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to unban from confessions!')
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
            if(!bUser) return interaction.reply({content:":no_entry: Can't find user! please mention the user in the command!", ephemeral: true });
            if(!confessbans.includes(bUser.id)) return interaction.reply({content:":no_entry: This user isnt banned from confessions!", ephemeral: true })
            var editedbansreg = new RegExp(bUser.id,'g');
            confessbans = confessbans.replace(editedbansreg, "")
            confessionbans[interaction.guild.id] = {
                confessionbans: confessbans
            };
            fs.writeFile("./Jsons/Confession/ConfessionBans.json", JSON.stringify(confessionbans), (err) => {
                if (err) console.log(err)
            });  
            let ConfessUnbanned = new MessageEmbed()
            .setTitle(`**Confession User UnBanned**`)
            .setColor("#00FF00")
            .setDescription(`${bUser} (${bUser.id}) has now been unbanned from using confessions on ${interaction.guild.name}!`)
            .setFooter("To ban this user again, do 'm;confessban'")
            interaction.reply({ embeds: [ConfessUnbanned], allowedMentions: {repliedUser: false}})   
            return
		}
	},
};