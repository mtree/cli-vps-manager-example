const Cli = require('structured-cli');
const Config = require('../lib/config');
const logger = new require('../lib/logger')();
const Api = require('../lib/api');
const util = require('util');
const _ = require('lodash');
const inquirer = require('inquirer');
const moment = require('moment');

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
		// Retrieve new apiKey if not exist or outdated
		if((_.isEmpty(output.apiKey)) || (!_.isEmpty(output.apiKey) && moment.utc(output.expires).isBefore())) {

			inquirer.prompt(credentialsPrompt).then(function(credentials) {
				api.getApiKey(args.username || credentials.username, credentials.password)
					.then(function(response) {
						configFile.storeApiKey(response.body._id, response.body.expiry)
							.then(function() {
								logger('info', 'You successfully logged and stored your apiKey in config file');
							})
							.catch(function(e) {
								throw e;
							});
					})
					.catch(function (e) {
						switch (e.status) {
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
		} else {
			logger('info', 'Your API key is already stored and you\'re ready to go!');
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
