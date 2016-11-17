const Cli = require('structured-cli');
const Config = require('../lib/config');
const logger = new require('../lib/logger')();
const util = require('util');

module.exports = Cli.createCommand('login', {
	description: 'Obtain your apiKey',
	// plugins: [],
	params: {
		'username': {
			description: 'Your h1 username',
			type: 'string'
		}
	},
	handler: loginHandler
});

function loginHandler(args) {
	let configFile = new Config();

	configFile.load().then(function(output) {
		logger('debug', output);
		logger('debug', util.inspect(args));
	});


}