const Cli = require('structured-cli');
const Config = require('../../lib/config');

module.exports = Cli.createCommand('login', {
	description: 'Obtain your apiKey',
	// plugins: [],
	params: {
		'user': {
			description: 'Your h1 username',
			type: 'string'
		}
	},
	handler: loginHandler
});

function loginHandler(args) {

}