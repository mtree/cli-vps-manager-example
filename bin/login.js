const Cli = require('structured-cli');
const Config = require('../lib/config');
const logger = new require('../lib/logger')();
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
	let questions;

	configFile.load().then(function(output) {
		if(_.isEmpty(output.apiKey) && _.isEmpty(args.username)) {

			inquirer.prompt(questions).then(function (answers) {
				logger('debug', util.inspect(answers));
			});
		}

	});

	questions = [
		{
			type: 'input',
			name: 'username',
			message: 'Your username'
		},
		{
			type: 'password',
			name: 'password',
			message: 'Your password'
		}
	];
}