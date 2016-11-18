#!/usr/bin/env node
'use strict';

const Cli = require('structured-cli');
const Chalk = require('chalk');

const cli = Cli.createApp({
    epilog: Chalk.bold('>login<') + ' to obtain apiKey' + '\n'
});

cli.addChild(require('./login'));
cli.addChild(require('./tenant'));
cli.addChild(require('./disk'));

Cli.run(cli)
