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
				api.getApiKey(args.username ||credentials.username, credentials.password)
					.then(function(response) {
						configFile.storeApiKey(response._id, response.expiry)
							.then(function() {
								logger('info', 'You successfully logged and stored your apiKey in config file');
							})
							.catch(function(e) {
								throw e;
							});
					})
					.catch(function (e) {
						switch (e.statusCode) {
							case 404:
								// unified messages for both: missing user and incorrect password
								logger('error', 'Your login or password is incorrect');
								break;
							case 401:
								logger('error', 'Your login or password is incorrect');
								break;
							default:
								logger('error', 'We have a problem sir!');
								throw e;
						}
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