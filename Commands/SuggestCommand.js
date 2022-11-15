const { EmbedBuilder } = require('discord.js');
var randomHexColor = require('random-hex-color')

module.exports = {
	name: 'suggest',
	description: 'Suggest something to the developer!',
	execute(message, args, client) {
        if(message.guild) return
        const filter = m => m.author.id == message.author.id
        let SuggestEmb = new EmbedBuilder()
        .setTitle(`**Suggest something to the developer!**`)
        .setColor(randomHexColor())
        .setDescription(`Please reply with what you want to suggest/tell the developer! \n __Your suggestion will be sent to the developer of Miku__`)
        .setFooter({text:'You have 1 minute to respond | type "cancel" to cancel'})
        message.reply({ embeds: [SuggestEmb], allowedMentions: { repliedUser: false }})
        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected =>{
            if(collected.first().content.toLocaleLowerCase() === 'cancel'){
                let SuggestCancelEmb = new EmbedBuilder()
                .setTitle('**Suggestion Cancelled**')
                .setColor('#FF0000')
                .setDescription('Your suggestion is now cancelled!')
                return message.reply({ embeds: [SuggestCancelEmb], allowedMentions: { repliedUser: false }})
            }
            client.users.fetch('920892427412340787', false).then((Owner) => {
                var currentDateAndTime = new Date().toLocaleString();
                let SuggestionEmbed = new EmbedBuilder()
                .setTitle(`**Suggestion:**`)
                .setColor(randomHexColor())
                .setDescription(`"${collected.first().content}" \n\n **User** \n ${message.author.tag} (${message.author.id})`)
                .setFooter({text:`${currentDateAndTime}`})
                Owner.send({ embeds: [SuggestionEmbed] })
            });
            let SuggestionCompletedEmb = new EmbedBuilder()
            .setTitle(`**Suggestion Sent**`)
            .setColor(randomHexColor())
            .setDescription(`Your suggestion has now been sent to the bot developer!`)
            message.channel.send({ embeds: [SuggestionCompletedEmb] })


        }).catch(() => {
            message.reply({ content: ':no_entry: No response, cancelling..', allowedMentions: { repliedUser: false }})
        });
	},
};