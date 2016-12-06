'use strict';

const Cli = require('structured-cli');
const _ = require('lodash');
const logger = new require('../../lib/logger')();
const Api = require('../../lib/api');
const Table = require('cli-table');

const options = {};

module.exports = Cli.createCommand('list', {
    description: 'Disk list',
    plugins: [
        require('../_plugins/loginRequired'),
        require('../_plugins/tenantRequired'),
        require('../_plugins/interactiveOptions')
    ],
    options: options,
    handler: handleDiskList
});

function handleDiskList(args) {

    const tableDef = {
        '_id': 'id',
        'name': 'disk name',
        'type': 'type',
        'size': 'size'
    };

    const api = new Api(args.profile);
    const table = new Table({
        head: _.map(Object.keys(tableDef), i => tableDef[i])
    });

    return api.get('/disk/')
    .then(function(res) {
        // logger('info', 'Your disk was successfully created')

        const data = res.map(disk => Object.keys(tableDef).map(i=>disk[i]) );
        table.push( ...data );

        console.log( table.toString() );
    })
    .catch(function(e) {
        logger('error', e.response.body.message);
    });

}
