#!/usr/bin/env node
'use strict';

const Cli = require('structured-cli');
const Chalk = require('chalk');

const configFile = require('../lib/config');

const cli = Cli.createApp({
    epilog: `${Chalk.bold('>login<')} to obtain apiKey\n`
});

cli.addChild(require('./login'));
cli.addChild(require('./tenant'));
cli.addChild(require('./disk'));

configFile
    .load()
    .then(() => Cli.run(cli))
    .catch(err => {
        if (err.status === 401) {
            console.log('Please login');
        } else {
            console.log('global catch');
            console.log(err);
            console.log('TODO handle', err.message, err.status || '');
        }
    });

