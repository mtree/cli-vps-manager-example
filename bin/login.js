'use strict';

const Cli = require('structured-cli');
const logger = new require('../lib/logger')();
const Api = require('../lib/api');
const _ = require('lodash');
const inquirer = require('inquirer');

const options = {
    'username': {
        description: 'Your username',
        type: 'string',
        defaultValue: (context) => {
            return inquirer.prompt({
                type: 'input',
                name: 'value',
                message: 'Your username:',
                validate: input =>_.isEmpty(input) ? 'Incorrect name' : true
            });
        }
    },
    'password': {
        description: 'Your password',
        type: 'string',
        defaultValue: (context) => {
            return inquirer.prompt({
                type: 'password',
                name: 'value',
                message: 'Your password:',
                validate: input =>_.isEmpty(input) ? 'Incorrect name' : true
            });
        }
    }
};

module.exports = Cli.createCommand('login', {
    description: 'Obtain your apiKey',
    plugins: [
        require('./_plugins/interactiveOptions')
    ],
    options: options,
    handler: loginHandler
});

function loginHandler(args) {
    const api = new Api();

    return api.getApiKey(args.username, args.password)
        .then(() => logger('info', 'You successfully logged and stored your apiKey in config file'))
        .catch(function (e) {
            switch (e.status) {
                case 404:
                    // unified messages for both: missing user and incorrect password
                    logger('error', `Your login or password is incorrect (${e.status})`);
                    break;
                case 401:
                    logger('error', `Your login or password is incorrect (${e.status})`);
                    break;
                default:
                    logger('error', 'We have a problem sir!');
                    throw e;
            }
        });

}
