const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('binary')
		.setDescription(`Encodes/Decodes Binary `)
        .addStringOption(option =>
            option.setName('function')
                .setDescription('Encode/Decode')
                .setRequired(true)
                .addChoices(
                    { name: 'Encode', value: 'binary_encode' },
                    { name: 'Decode', value: 'binary_decode' },
                ))
        .addStringOption(option =>
            option
                .setName('text')
                .setRequired(true)
                .setDescription('The text to encode/decode')),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            const binaryfunction = interaction.options.getString('function');
            const binarytext = interaction.options.getString('text');
            //Encode
            if(binaryfunction=="binary_encode"){
                
                fetch(`https://some-random-api.com/binary?encode=${binarytext}`)
                    .then(res => res.json())
                    .then(async json => {
                        let str = json.binary.slice(0, 1950) //1950 char limit
                        await interaction.editReply({ content: `Here you go.. \n \`${str}\``, ephemeral: false });
                    });
            }
            //Decode
            if(binaryfunction=="binary_decode"){
                
                fetch(`https://some-random-api.com/binary?decode=${binarytext}`)
                .then(res => res.json())
                .then(async json => {
                    let str = json.text.slice(0, 1950) //1950 char limit
                    await interaction.editReply({ content: `Here you go.. \n \`${str}\``, ephemeral: false });
                });
            }
		}
	},
};