const Cli = require('structured-cli');
const Config = require('../lib/config');
const logger = new require('../lib/logger')();
const Api = require('../lib/api');
const util = require('util');
const _ = require('lodash');
const inquirer = require('inquirer');
const moment = require('moment');


module.exports = Cli.createCommand('tenant', {
	description: 'Pick subscribed tenant',
	handler: tenantHandler
});

function tenantHandler(args) {
	const configFile = new Config();
	const api = new Api();


	configFile.load().then(function(output) {
		if((_.isEmpty(output.apiKey)) || (!_.isEmpty(output.apiKey) && moment.utc(output.expires).isBefore())) {
			logger('info', 'Login first before you can obtain your tenants');
		} else {
			api.getTenants(output.apiKey)
				.then(function(res) {
					return _.map(res.body, function(el) {
						if (el.active)
							return {
								value: el._id,
								name: el.name + ' (' + el.billing.credits + el.billing.currency + ') (...' + el._id.slice(-5) + ')'
							}
					});
				})
				.then(function(tenants) {
					tenantsPrompt = [
						{
							type: 'rawlist',
							name: 'tenant',
							message: 'Select your tenant',
							choices: tenants
							// 'when' for confirmation?
						}
					];
					inquirer.prompt(tenantsPrompt)
						.then(function(answer) {
							configFile.storeTenant(answer.tenant)
							.then(function() {
								logger('info', 'Tenant selected');
							})
							.catch(function(e) {
								throw e;
							});
						});
				});
		}

	});


}
