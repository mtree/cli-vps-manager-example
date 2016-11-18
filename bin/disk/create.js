'use strict';

const util = require('util');
const Cli = require('structured-cli');
const _ = require('lodash');
const moment = require('moment');
const Config = require('../../lib/config');
const logger = new require('../../lib/logger')();
const Api = require('../../lib/api');
const inquirer = require('inquirer');

module.exports = Cli.createCommand('create', {
    description: 'Create disk',
    // plugins: [
    //     // require('../_plugins/profile'),
    // ],
    // optionGroups: {
    //     'Synchronization options': {
    //         interactive: {
    //             alias: 'i',
    //             description: 'Interactively prompt you for which packages to synchronize and which to leave untouched.',
    //             type: 'boolean',
    //         },
    //     },
    // },
    // params: {
    //     'filename': {
    //         description: 'Path to the webtask\'s code.',
    //         type: 'string',
    //         defaultValue: Path.join(process.cwd(), 'webtask.js'),
    //     },
    // },
    handler: handleDiskCreate,
});


// Command handler

function handleDiskCreate(args) {
    const configFile = new Config();
    const api = new Api();

    configFile.load()
        .then(function(output) {
            // Retrieve new apiKey if not exist or outdated
            if((_.isEmpty(output.apiKey)) || (!_.isEmpty(output.apiKey) && moment.utc(output.expires).isBefore())) {
                logger('info', 'Login first before you can obtain your tenants');
            } else {
                api.getDiskOptions(output.apiKey)
                    .then(function(res) {
                        return _.map(res.body, function(el) {
                            return {
                                value: el._id,
                                name: el.name + ' (Max IOPS:  ' + el.data.maximumIOPS + ')'
                            }
                        });
                    })
                    .then(function(diskOptions) {
                        let diskOptionsPrompt = [
                            {
                                type: 'rawlist',
                                name: 'diskOptions',
                                message: 'Select your disk type',
                                choices: diskOptions
                            },
                            {
                                type: 'input',
                                name: 'diskSize',
                                message: 'Define your new disk size (GB)',
                                validate: function (input) {
                                    return _.inRange(input, 1, 1000) ? true : 'Please provide a number between 1 and 1000';
                                }

                            },
                            {
                                type: 'input',
                                name: 'diskName',
                                message: 'Type name for your new disk',

                            }
                        ];

                        return inquirer.prompt(diskOptionsPrompt)
                            .then(function(answer) {

                            });
                    })
                    .catch(function (e) {
                        throw e;
                    });
            }
        });
}
