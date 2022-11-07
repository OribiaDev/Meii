const { MessageEmbed } = require('discord.js');
var randomHexColor = require('random-hex-color')

module.exports = {
	name: 'suggest',
	description: 'Suggest something to the developer!',
	execute(message, args, client) {
        if(message.guild) return
        const filter = m => m.author.id == message.author.id
        let SuggestEmb = new MessageEmbed()
        .setTitle(`**Suggest something to the developer!**`)
        .setColor(randomHexColor())
        .setDescription(`Please reply with what you want to suggest/tell the developer! \n __Your suggestion will be sent to the developer of Miku__`)
        .setFooter('You have 1 minute to respond | type "cancel" to cancel')
        message.reply({ embeds: [SuggestEmb], allowedMentions: { repliedUser: false }})
        message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected =>{
            if(collected.first().content.toLocaleLowerCase() === 'cancel'){
                let SuggestCancelEmb = new MessageEmbed()
                .setTitle('**Suggestion Cancelled**')
                .setColor('#FF0000')
                .setDescription('Your suggestion is now cancelled!')
                return message.reply({ embeds: [SuggestCancelEmb], allowedMentions: { repliedUser: false }})
            }
            client.users.fetch('857352321263337555', false).then((Owner) => {
                var currentDateAndTime = new Date().toLocaleString();
                let SuggestionEmbed = new MessageEmbed()
                .setTitle(`**Suggestion**`)
                .setColor(randomHexColor())
                .setDescription(`"${collected.first().content}" \n\n **User** \n ${message.author.tag} (${message.author.id})`)
                .setFooter(currentDateAndTime)
                Owner.send({ embeds: [SuggestionEmbed] })
            });
            let SuggestionCompletedEmb = new MessageEmbed()
            .setTitle(`**Suggestion Sent**`)
            .setColor(randomHexColor())
            .setDescription(`Your suggestion has now been sent to the bot developer!`)
            message.channel.send({ embeds: [SuggestionCompletedEmb] })


        }).catch(() => {
            message.reply({ content: 'No response, cancelling..', allowedMentions: { repliedUser: false }})
        });
	},
};