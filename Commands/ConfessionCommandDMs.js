module.exports = {
	name: 'confession_command_dms',
	description: 'Submit a confession!',
	async execute(message) {
        message.reply(`Im sorry, this command has been deprecated. If you wish to confess please use \`/confess\` in the server you wish to confess too. \n**No one** is able to see that you used the command.`)
	},
};