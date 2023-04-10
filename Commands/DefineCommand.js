const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const randomHexColor = require('random-hex-color')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('define')
		.setDescription(`Gets the definition of a word`)
        .addStringOption(option =>
			option
				.setName('word')
                .setRequired(true)
				.setDescription('The word to lookup')),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
            await interaction.deferReply();
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            const word = interaction.options.getString('word');
                let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)        
                if(data.statusText == 'Not Found') return await interaction.editReply({ content: `\`I cannot find that word!\``, allowedMentions: { repliedUser: false }, ephemeral: true })     
                let info = await data.json();
                let result = info[0];         
                //Embed Data
                let embinfo = await result.meanings.map((data, index) => {
                    let definition = data.definitions[0].definition || 'No Definition Found';
                    let example = data.definitions[0].example || ' No Example Found';
                    //Cap. Type of word
                    const word = data.partOfSpeech
                    const firstLetter = word.charAt(0)
                    const firstLetterCap = firstLetter.toUpperCase()
                    const remainingLetters = word.slice(1)
                    const capitalizedWord = firstLetterCap + remainingLetters
                    return{
                        name: capitalizedWord,
                        value: `__Definition:__ ${definition} \n __Example:__ ${example}`
                    }
                })
                const dicembed = new EmbedBuilder()
                .setColor(randomHexColor())
                .addFields(
                        { name: 'Word', value: `${result.word}`, inline: true },
                        { name: '\n\n\n', value: ' ' },
                )
                .addFields(embinfo)
                .addFields(
                    { name: '\n\n\n', value: ' ' },
                )
                .setFooter({text:`Requested by ${interaction.member.user.tag}   •   ${currentDateAndTime}`})
                await interaction.editReply({ embeds: [dicembed], allowedMentions: { repliedUser: false }})
		}
	},
};