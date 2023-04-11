const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Permissions } = require('discord.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all Meii commands!')
        .addStringOption(option =>
            option.setName('section')
                .setDescription('The help sections')
                .setRequired(false)
                .addChoices(
                    { name: 'Confessions', value: 'help_confessions' },
                    { name: 'Moderation', value: 'help_moderation' },
                    { name: 'Fun', value: 'help_fun' },
                    { name: 'Emotes', value: 'help_emotes' },
                    { name: 'Utilitys', value: 'help_utilitys' },
                )),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            
            const section = interaction.options.getString('section');
            if(section){
                if(section=="help_confessions"){
                    //Confession Section
                    let HelpConfessions = new EmbedBuilder()
                    .setTitle(":scream:  **Confession Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Confession Tutorial:** \n To submit a confession to a server, message Meii  'confess'  and type the name of the server (spelling, capitalization, fonts, emojis, all matter!) or the server ID of the server. To get a server ID follow [this](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) tutorial. \n\n **Commands:**\n :speech_left: \`${prefix}setconfesschannel [#channel]\`: \n Sets the confession channel \n\n :hammer_pick: \`${prefix}setconfesslogs [#channel]\`: \n Sets the logging channel for confessions \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [HelpConfessions], allowedMentions: { repliedUser: false }})
                }
                if(section=="help_moderation"){
                    //Moderation Section
                    let HelpModeration = new EmbedBuilder()
                    .setTitle(":tools:  **Moderation Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :hammer: \`${prefix}confessban [@someone]\`: \n Bans someone from using confessions \n\n :no_entry_sign: \`${prefix}confessunban [@someone]\`: \n Unbans someone from using confessions \n\n :hammer: \`${prefix}ban [@someone]\`: \n Bans mentioned user from the server \n\n :leg: \`${prefix}kick [@someone]\`: \n kicks mentioned user from the server \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [HelpModeration], allowedMentions: {repliedUser: false}})
                }
                if(section=="help_fun"){
                    //Fun Section
                    let HelpFun = new EmbedBuilder()
                    .setTitle(":confetti_ball:  **Fun Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :raccoon: \`${prefix}animal [category]\`: \n Sends a random image of an animal \n\n :book: \`${prefix}define [word]\`: \n Sends the definition of a word \n\n :1234: \`${prefix}binary [encode/decode] [text]\`: \n Encodes/Decodes binary \n\n:laughing: \`${prefix}joke\`: \n Sends a ~~corny~~ joke \n\n :confetti_ball: \`${prefix}dice\`: \n Rolls a 6 sided die! \n\n :coin: \`${prefix}coinflip\`: \n Flips a coin! \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [HelpFun], allowedMentions: {repliedUser: false}})
                }
                if(section=="help_emotes"){
                    //Emotes Section
                    let HelpEmotes = new EmbedBuilder()
                    .setTitle(":kissing_heart:  **Emote Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :kissing_heart:  \`${prefix}kiss [@someone]\`: \n Kisses the mentioned person \n\n :hugging: \`${prefix}hug [@someone]\`: \n Hugs the mentioned person \n\n :people_hugging:  \`${prefix}cuddle [@someone]\`: \n Cuddles the mentioned person \n\n :raised_hand: \`${prefix}slap [@someone]\`: \n Slaps the mentioned person \n\n :knife: \`${prefix}kill [@someone]\`: \n Kills the mentioned person \n\n :hammer: \`${prefix}bonk [@someone]\`: \n Bonks the mentioned person \n\n :smiling_imp: \`${prefix}yeet [@someone]\`: \n Yeets the mentioned person \n\n :people_holding_hands:  \`${prefix}handhold [@someone]\`: \n Holds the mentioned person's hands \n\n :point_right: \`${prefix}poke [@someone]\`: \n Pokes the mentioned person \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [HelpEmotes], allowedMentions: { repliedUser: false }})
                }
                if(section=="help_utilitys"){
                    //Utilitys Section
                    let HelpUtility = new EmbedBuilder()
                    .setTitle(":wrench:  **Utility Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :information_source: \`${prefix}info [user/server]\`: \n Gets information about a person or server \n\n :ping_pong: \`${prefix}ping\`: \n Tells the bots ping \n\n :robot: \`${prefix}stats\`: \n Shows the bots stats \n\n :timer: \`${prefix}uptime\`: \n Shows the uptime of Meii \n\n :sparkles: \`${prefix}support\`: \n Sends the invite to the support server \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [HelpUtility], allowedMentions: { repliedUser: false }})
                }
            }else{
                //Generic Help Command
                let Help = new EmbedBuilder()
                .setTitle("**Meii Command List**")
                .setColor("#C3B1E1")
                .setDescription(`:scream: **Confessions** \n \`${prefix}help confessions\` \n\n :tools: **Moderation** \n \`${prefix}help moderation\` \n\n :confetti_ball:  **Fun** \n \`${prefix}help fun\` \n\n :kissing_heart: **Emotes** \n \`${prefix}help emotes\` \n\n :wrench: **Utility** \n \`${prefix}help utility\` \n\n _____ \n **Website:** \n https://meiibot.xyz \n\n Need help? Join the [support server.](https://discord.gg/J7QehvdDMq)`)
                await interaction.editReply({ embeds: [Help], allowedMentions: { repliedUser: false }})
            }
		}
	},
};