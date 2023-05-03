const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
require("moment-duration-format")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription(`Sends Meii's uptime`),
	async execute(interaction, args, client, prefix) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
			const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            await interaction.editReply({ content: `My Uptime: \`${uptime}\``, ephemeral: false });
            return
		}
	},
};
