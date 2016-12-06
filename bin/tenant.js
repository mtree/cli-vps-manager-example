'use strict';

const Cli = require('structured-cli');
const configFile = require('../lib/config');
const logger = new require('../lib/logger')();
const Api = require('../lib/api');
const inquirer = require('inquirer');

module.exports = Cli.createCommand('tenant', {
    description: 'Pick subscribed tenant',
    plugins: [
        require('./_plugins/loginRequired')
    ],
    handler: tenantHandler
});

function tenantHandler(args) {
    const api = new Api(args.profile);

    return api.getTenants()
        .then(function(res) {
            return res.filter(el => el.active).map(function(el) {
                return {
                    value: el._id,
                    name: `${el.name} (${el.billing.credits}${el.billing.currency}) (...${el._id.slice(-5)})`
                };
            });
        })
        .then(function(tenants) {
            const tenantsPrompt = [
                {
                    type: 'rawlist',
                    name: 'tenant',
                    message: 'Select your tenant',
                    choices: tenants
                    // 'when' for confirmation?
                }
            ];

            return inquirer.prompt(tenantsPrompt)
                .then(function(answer) {
                    return configFile.storeTenant(answer.tenant)
                        .then(() => logger('info', 'Tenant selected'));
                });
        });
}
