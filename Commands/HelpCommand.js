const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Permissions } = require('discord.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all Miku commands!')
        .addStringOption(option =>
            option.setName('section')
                .setDescription('Specific section of the help command')
                .setRequired(false)),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            const section = interaction.options.getString('section');
            if(section=="confessions" || section=="moderation" || section=="fun" || section=="actions" || section=="utility"){
                switch(section.toLowerCase()){
                    case "confessions":
                        let HelpConfessions = new EmbedBuilder()
                        .setTitle("**Confession Commands**")
                        .setColor("#ff9aa2")
                        .setDescription(`**Confession Tutorial:** \n To submit a confession to a server, DM the bot "confess" and type the __exact__ name of the server (spelling, capitalization, fonts, and emojis, etc. all matter!) or the ID of that server, to get a server ID follow this tutorial.. \n https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID- \n\n **Commands:**\n :speech_left: **${prefix}confesschannel [#channel]**: Allows you to set the confession channel \n\n :hammer_pick: **${prefix}confesslogs [#channel]**: Sets the logging channel for confessions `)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpConfessions], allowedMentions: { repliedUser: false }})
                        break;
                    case "moderation":
                        let HelpModeration = new EmbedBuilder()
                        .setTitle("**Moderation Commands**")
                        .setColor("#ff9aa2")
                        .setDescription(`:hammer: **${prefix}confessban [@someone]**: Bans someone from using confessions \n\n :hammer: **${prefix}confessunban [@someone]**: Unbans someone from using confessions `)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpModeration], allowedMentions: {repliedUser: false}})
                        break;
                    case "fun":
                        let HelpFun = new EmbedBuilder()
                        .setTitle("**Fun Commands**")
                        .setColor("#ff9aa2")
                        .setDescription(`:confetti_ball: **${prefix}dice**: Rolls a 6 sided die! \n\n `)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpFun], allowedMentions: {repliedUser: false}})
                        break;
                    case "actions":
                        let HelpActions = new EmbedBuilder()
                        .setTitle("**Action Commands**")
                        .setColor("#ff9aa2")
                        .setDescription(`:kissing_heart:  **${prefix}kiss [@someone]**: kisses said person! \n\n :hugging: **${prefix}hug [@someone]**: hugs said person! \n\n :people_hugging:  **${prefix}cuddle [@someone]**: cuddles said person! \n\n :raised_hand: **${prefix}slap [@someone]**: slaps said person! \n\n :knife: **${prefix}kill [@someone]**: kills said person! \n\n :hammer: **${prefix}bonk [@someone]**: bonks said person! \n\n :smiling_imp: **${prefix}yeet [@someone]**: yeets said person! \n\n :people_holding_hands:  **${prefix}handhold [@someone]**: holds said person's hands! \n\n :point_right: **${prefix}poke [@someone]**: pokes said person! \n\n`)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpActions], allowedMentions: { repliedUser: false }})
                        break;
                    case "utility":
                        let HelpUtility = new EmbedBuilder()
                        .setTitle("**Utility Commands**")
                        .setColor("#ff9aa2")
                        .setDescription(`:ping_pong: **${prefix}ping**: Tells the bots ping \n\n :information_source: **${prefix}info**: Shows the bots info `)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpUtility], allowedMentions: { repliedUser: false }})
                        break;
                }
            }else{
                let Help = new EmbedBuilder()
                .setTitle("**Miku Command List**")
                .setColor("ff9aa2")
                .setDescription(`:scream: **Confessions** \n ${prefix}help confessions \n\n :tools: **Moderation** \n ${prefix}help moderation \n\n :confetti_ball:  **Fun** \n ${prefix}help fun \n\n :kissing_heart: **Actions** \n ${prefix}help actions \n\n :wrench: **Utility** \n ${prefix}help utility `)
                .setFooter({text:'DM me "suggest" and follow the prompts to suggest something to the dev!'})
                interaction.reply({ embeds: [Help], allowedMentions: { repliedUser: false }})
                return
            }
            return
		}
	},
};