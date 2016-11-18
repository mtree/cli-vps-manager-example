#!/usr/bin/env node

const Cli = require('structured-cli');
const Chalk = require('chalk');

const cli = Cli.createApp({
    epilog: Chalk.bold('>login<') + ' to obtain apiKey' + '\n'
});

cli.addChild(require('./login'));
cli.addChild(require('./tenant'));

Cli.run(cli)
