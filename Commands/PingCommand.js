const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Gives the ping of Meii!'),
	async execute(interaction, args, client) {
        if(!interaction.guild) return
		if(interaction.content==undefined){
            //Interaction
            const m = await interaction.channel.send("Ping?");
            interaction.reply(`:ping_pong: Pong! | Latency is ${m.createdTimestamp - interaction.createdTimestamp}ms | API latency is ${client.ws.ping}ms`)
            m.delete()
			return
		}
	},
};