const {  ComponentType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, Permissions, SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(`Menu of all Meii's commands`),
	async execute(interaction, db, databaseCollections, client, shardCollections) {
		const select = new StringSelectMenuBuilder()
        .setCustomId('help_menu')
        .setPlaceholder('Choose a help section')
        .addOptions( 
            new StringSelectMenuOptionBuilder()
                .setLabel('Confessions')
                .setDescription('Help menu for confession commands')
                .setEmoji('😱')
                .setValue('help_confessions'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Moderation')
                .setDescription('Help menu for moderation commands')
                .setEmoji('🛠️')
                .setValue('help_moderation'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Fun')
                .setDescription('Help menu for fun commands')
                .setEmoji('🎊')
                .setValue('help_fun'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Emotes')
                .setDescription('Help menu for emote commands')
                .setEmoji('😘')
                .setValue('help_emotes'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Utility')
                .setDescription('Help menu for utility commands')
                .setEmoji('🔧')
                .setValue('help_utility'),
        );
        //Create Row
        const row = new ActionRowBuilder()
        .addComponents(select);

        //Send Inital Message
        let initialHelpMenu = new EmbedBuilder()
        .setTitle(":question: **Meii Help Menu**")
        .setColor("#C3B1E1")
        .setDescription(`Please use the dropdown menu below to select a help section.\n _ \n Need help? Join the [support server.](https://discord.gg/E23tPPTwSc)`)
		const response = await interaction.reply({
            embeds: [initialHelpMenu],
			components: [row],
		});

        //Collect Response
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect});
        collector.on('collect', async i => {
            //Old Message Handler (Critical Error w/o)
            const fifteenMinutesAgo = 15 * 60 * 1000; // 15 minutes in milliseconds
            const currentTime = new Date();
            const messageTimestamp = i.message.createdTimestamp;
            const differenceofTime = currentTime - messageTimestamp;
            if (differenceofTime > fifteenMinutesAgo) return;
            const selection = i.values[0];
            //Help Menus
            switch (selection) {
                //Confesion
                case 'help_confessions':
                    let confessionHelpMenu = new EmbedBuilder()
                    .setTitle(":scream:  **Confession Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Confession Tutorial:** \n To submit a confession, simply use the command \`/confess\` along with the message in the server you wish to confess too. \n\n **Commands:**\n :grey_question: \`/confess [message]\` \n Sends an anonymous confession \n\n :pen_ballpoint: \`/reply [confession_id] [message]\`: \n Anonymously replys to a sent confession \n\n :wastebasket: \`/delete [confession_id]\`: \n Allows you to delete a confession that was sent by you, only up to 30min after it's sent\n\n :exclamation: \`/report [confession_id]\`: \n Reports a confession\n\n :hammer_pick: \`/settings\`: \n Allows you to setup confessions and change various settings \n\n:clipboard: \`/customize\`: \n Lets you customize the confession embed \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [confessionHelpMenu], allowedMentions: { repliedUser: false }})
                    break;
                //Moderation
                case 'help_moderation':
                    let moderationHelpMenu = new EmbedBuilder()
                    .setTitle(":tools:  **Moderation Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :hammer: \`/ban [@someone]\`: \n Bans mentioned user from the server \n\n :leg: \`/kick [@someone]\`: \n kicks mentioned user from the server \n\n :hammer: \`/confessban [user/confession]\`: \n Bans someone from using confessions \n\n :no_entry_sign: \`/confessunban [user/confession]\`: \n Unbans someone from using confessions \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)                   
                    await interaction.editReply({ embeds: [moderationHelpMenu], allowedMentions: { repliedUser: false }})
                    break;
                //Fun
                case 'help_fun':
                    let funHelpMenu = new EmbedBuilder()
                    .setTitle(":confetti_ball:  **Fun Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :raccoon: \`/animal [category]\`: \n Sends a random image of an animal \n\n :book: \`/define [word]\`: \n Sends the definition of a word \n\n :1234: \`/binary [encode/decode] [text]\`: \n Encodes/Decodes binary \n\n:laughing: \`/joke\`: \n Sends a ~~corny~~ joke \n\n :confetti_ball: \`/dice\`: \n Rolls a 6 sided die! \n\n :coin: \`/coinflip\`: \n Flips a coin! \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)                
                    await interaction.editReply({ embeds: [funHelpMenu], allowedMentions: { repliedUser: false }})
                    break;     
                //Emotes
                case 'help_emotes':
                    let emoteHelpMenu = new EmbedBuilder()
                    .setTitle(":kissing_heart:  **Emote Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n :kissing_heart:  \`/kiss [@someone]\`: \n Kisses the mentioned person \n\n :hugging: \`/hug [@someone]\`: \n Hugs the mentioned person \n\n :people_hugging:  \`/cuddle [@someone]\`: \n Cuddles the mentioned person \n\n :raised_hand: \`/slap [@someone]\`: \n Slaps the mentioned person \n\n :knife: \`/kill [@someone]\`: \n Kills the mentioned person \n\n :hammer: \`/bonk [@someone]\`: \n Bonks the mentioned person \n\n :smiling_imp: \`/yeet [@someone]\`: \n Yeets the mentioned person \n\n :people_holding_hands:  \`/handhold [@someone]\`: \n Holds the mentioned person's hands \n\n :point_right: \`/poke [@someone]\`: \n Pokes the mentioned person \n\n :wave: \`/wave [@someone]\`: \n Waves at the mentioned person \n\n :palm_down_hand: \`/pat [@someone]\`: \n Gives the mentioned person head pats \n\n :rage: \`/bully [@someone]\`: \n Bullys the mentioned person \n\n :tongue: \`/lick [@someone]\`: \n Licks the mentioned person \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [emoteHelpMenu], allowedMentions: { repliedUser: false }})
                    break;
                //Utility
                case 'help_utility':
                    let utilityHelpMenu = new EmbedBuilder()
                    .setTitle(":wrench:  **Utility Commands**")
                    .setColor("#C3B1E1")
                    .setDescription(`**Commands:**\n:information_source: \`/info [user/server]\`: \n Gets information about a person or server \n\n :x: \`/delete_data\`: \n Deletes all data for the current server \n (Only usable by server owner) \n\n :ping_pong: \`/ping\`: \n Shows the bots ping \n\n :robot: \`/stats\`: \n Shows the bots stats \n\n :gem: \`/shards:\` \n Shows Meii's shard info \n\n :timer: \`/uptime\`: \n Shows the uptime of Meii \n\n :sparkles: \`/support\`: \n Sends the invite to the support server \n\n\n • Enjoying Meii? Vote for Meii [here!](https://top.gg/bot/1082401009206308945/vote) \n`)
                    await interaction.editReply({ embeds: [utilityHelpMenu], allowedMentions: { repliedUser: false }})
                    break;           
            } 
            //Defer i so doesnt dropdown doesnt timeout
            i.deferUpdate();
        });
	},
};