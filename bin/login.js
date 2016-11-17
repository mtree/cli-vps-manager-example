const Cli = require('structured-cli');
const Config = require('../lib/config');
const logger = new require('../lib/logger')();
const Api = require('../lib/api');
const util = require('util');
const _ = require('lodash');
const inquirer = require('inquirer');

module.exports = Cli.createCommand('login', {
	description: 'Obtain your apiKey',
	// plugins: [],
	options: {
		'username': {
			description: 'Your h1 username',
			type: 'string'
		}
	},
	handler: loginHandler
});

function loginHandler(args) {
	let configFile = new Config();
	let api = new Api();
	let credentialsPrompt;

	configFile.load().then(function(output) {
		if(_.isEmpty(output.apiKey)) {

			inquirer.prompt(credentialsPrompt).then(function(credentials) {
				api.getApiKey(credentials.username, credentials.password)
					.then(function(response) {
						logger('debug', util.inspect(response));
					})
					.catch(function (e) {
						throw e;
					});
			});
		}

	});

	credentialsPrompt = [
		{
			type: 'input',
			name: 'username',
			message: 'Your username',
			when: _.isEmpty(args.username)
		},
		{
			type: 'password',
			name: 'password',
			message: 'Your password'
		}
	];
}