#!/usr/bin/env node

const Winston = require('winston');
const Cli = require('structured-cli');

// const job = require('../babel/job');
// const configure = job.configure;
// const run = job.run;

const cli = Cli.createApp({
    prolog: 'h1 cli'
});

// configure();
// run().then(credentials => {
//   winston.log('info', 'Success!');
//   winston.log('info', credentials);
// }).catch(err => {
//   winston.log('error', err);
// });

Cli.run(cli)