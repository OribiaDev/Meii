const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Permissions } = require('discord.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all Meii commands!')
        .addStringOption(option =>
            option.setName('section')
                .setDescription('Specific section of the help command')
                .setRequired(false)),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            const section = interaction.options.getString('section');
            if(section=="confessions" || section=="moderation" || section=="fun" || section=="emotes" || section=="utility"){
                switch(section.toLowerCase()){
                    case "confessions":
                        let HelpConfessions = new EmbedBuilder()
                        .setTitle("**Confession Commands**")
                        .setColor("#C3B1E1")
                        .setDescription(`**Confession Tutorial:** \n To submit a confession to a server, message Meii "confess" and type the __exact__ name of the server (spelling, capitalization, fonts, and emojis, etc. all matter!) or the server ID of that server, to get a server ID follow this tutorial.. \n https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID- \n\n **Commands:**\n :speech_left: **${prefix}setconfesschannel [#channel]**: Sets the confession channel \n\n :hammer_pick: **${prefix}setconfesslogs [#channel]**: Sets the logging channel for confessions `)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpConfessions], allowedMentions: { repliedUser: false }})
                        break;
                    case "moderation":
                        let HelpModeration = new EmbedBuilder()
                        .setTitle("**Moderation Commands**")
                        .setColor("#C3B1E1")
                        .setDescription(`:hammer: **${prefix}confessban [@someone]**: Bans someone from using confessions \n\n :hammer: **${prefix}confessunban [@someone]**: Unbans someone from using confessions \n\n :hammer: **${prefix}ban [@someone]**: Bans mentioned user from the server \n\n :leg: **${prefix}kick [@someone]**: kicks mentioned user from the server \n\n`)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpModeration], allowedMentions: {repliedUser: false}})
                        break;
                    case "fun":
                        let HelpFun = new EmbedBuilder()
                        .setTitle("**Fun Commands**")
                        .setColor("#C3B1E1")
                        .setDescription(`:confetti_ball: **${prefix}dice**: Rolls a 6 sided die! \n\n :coin: **${prefix}coinflip**: Flips a coin! \n\n`)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpFun], allowedMentions: {repliedUser: false}})
                        break;
                    case "emotes":
                        let HelpEmotes = new EmbedBuilder()
                        .setTitle("**Emote Commands**")
                        .setColor("#C3B1E1")
                        .setDescription(`:kissing_heart:  **${prefix}kiss [@someone]**: kisses the mentioned person! \n\n :hugging: **${prefix}hug [@someone]**: hugs the mentioned person! \n\n :people_hugging:  **${prefix}cuddle [@someone]**: cuddles the mentioned person! \n\n :raised_hand: **${prefix}slap [@someone]**: slaps the mentioned person! \n\n :knife: **${prefix}kill [@someone]**: kills the mentioned person! \n\n :hammer: **${prefix}bonk [@someone]**: bonks the mentioned person! \n\n :smiling_imp: **${prefix}yeet [@someone]**: yeets the mentioned person! \n\n :people_holding_hands:  **${prefix}handhold [@someone]**: holds the mentioned person's hands! \n\n :point_right: **${prefix}poke [@someone]**: pokes the mentioned person! \n\n`)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpEmotes], allowedMentions: { repliedUser: false }})
                        break;
                    case "utility":
                        let HelpUtility = new EmbedBuilder()
                        .setTitle("**Utility Commands**")
                        .setColor("#C3B1E1")
                        .setDescription(`:ping_pong: **${prefix}ping**: Tells the bots ping \n\n :information_source: **${prefix}stats**: Shows the bots stats \n\n :sparkles: **${prefix}support**: Sends the invite to the support server \n\n`)
                        .setFooter({text:"[something] = required | (something) = optional "})
                        interaction.reply({ embeds: [HelpUtility], allowedMentions: { repliedUser: false }})
                        break;
                }
            }else{
                let Help = new EmbedBuilder()
                .setTitle("**Meii Command List**")
                .setColor("C3B1E1")
                .setDescription(`:scream: **Confessions** \n ${prefix}help confessions \n\n :tools: **Moderation** \n ${prefix}help moderation \n\n :confetti_ball:  **Fun** \n ${prefix}help fun \n\n :kissing_heart: **Emotes** \n ${prefix}help emotes \n\n :wrench: **Utility** \n ${prefix}help utility \n\n _____ \n **Offical Website** \n https://meiibot.xyz `)
                .setFooter({text:'DM me "suggest" and follow the prompts to suggest something to the dev!'})
                interaction.reply({ embeds: [Help], allowedMentions: { repliedUser: false }})
                return
            }
            return
		}
	},
};