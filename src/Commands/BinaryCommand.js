const { SlashCommandBuilder, MessageFlags } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('binary')
		.setDescription(`Allows you to Encode/Decode Binary`)
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
	async execute(interaction) {
        const binaryfunction = interaction.options.getString('function');
        const binarytext = interaction.options.getString('text');
        //Encode
        if(binaryfunction=="binary_encode"){          
            fetch(`https://api.some-random-api.com/binary?encode=${binarytext}`)
            .then(async (res) => {
                if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
                const responseBody = await res.text();
                let json = JSON.parse(responseBody);
                let str = json.encoded.slice(0, 1950) //1950 char limit
                await interaction.reply({ content: `Here you go.. \n \`${str}\``, flags: MessageFlags.Ephemeral  });
            });
        }
        //Decode
        if(binaryfunction=="binary_decode"){     
            fetch(`https://api.some-random-api.com/binary?decode=${binarytext}`)
            .then(async (res) => {
                if(!res.ok) return await interaction.reply({ content:"I'm sorry, the API is currently offline. Please try again later.", flags: MessageFlags.Ephemeral  });
                const responseBody = await res.text();
                let json = JSON.parse(responseBody);
                let str = json.decoded.slice(0, 1950) //1950 char limit
                await interaction.reply({ content: `Here you go.. \n \`${str}\``, flags: MessageFlags.Ephemeral  });
            })
        }
	},
};