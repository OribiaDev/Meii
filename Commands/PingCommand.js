const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Gives the ping of Meii!'),
	async execute(interaction, args, client) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
            //Interaction
			//Permission Check
			if(!interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(client.user).has(PermissionFlagsBits.ViewChannel)){
				return interaction.reply({ content: `I'm sorry, I do not have enough permissions for this command! \n I need \`Send Messages\`, and \`Read Message History\``, ephemeral: true }).catch(() => {
					return; 
				})
			}
            const m = await interaction.channel.send("Ping?");
            await interaction.reply(`:ping_pong: Pong! | Latency is \`${m.createdTimestamp - interaction.createdTimestamp}ms\` | API latency is \`${client.ws.ping}ms\``)
            m.delete()
			return
		}
	},
};