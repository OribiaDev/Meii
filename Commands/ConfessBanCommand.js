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
            if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content:":no_entry: You cannot use this command!", ephemeral: true })
            let bUser = interaction.options.getMember('user');
            if(!bUser) return interaction.reply({ content:":no_entry: Can't find user! please mention the user in the command!", ephemeral: true });
            if(bUser.id=='1041822625535623259') return interaction.reply({content:":no_entry: You can't ban me silly~!", ephemeral: true })
            if(confessbans.includes(bUser.id)) return interaction.reply({ content:":no_entry: This user is already banned from confessions!", ephemeral: true })
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