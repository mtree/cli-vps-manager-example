'use strict';

const Cli = require('structured-cli');
const logger = new require('../../lib/logger')();
const Api = require('../../lib/api');
const interactive = require('../../lib/interactive');
const Table = require('cli-table');

const options = {
    'json': {
        description: 'json output',
        type: 'boolean',
        defaultValue: false,
        dest: 'outputJson'
    }
};

const params = {
    'id': {
        description: 'Disk identifier',
        type: 'string',
        defaultValue: () => interactive.prompt('disk identifier')
    }
};

module.exports = Cli.createCommand('show', {
    description: 'Disk show',
    plugins: [
        require('../_plugins/loginRequired'),
        require('../_plugins/tenantRequired'),
        require('../_plugins/interactiveOptions')
    ],
    options: options,
    params: params,
    handler: handleDiskShow
});

function handleDiskShow(args) {

    const tableDef = {
        '_id': 'id',
        'name': 'disk name',
        'type': 'type',
        'size': 'size'
    };

    const api = new Api(args.profile);
    const table = new Table({
        head: Object.keys(tableDef).map(i => tableDef[i])
    });

    return api.get(`/disk/${args.id}`)
    .then(res => {

        if( args.outputJson ) {
            console.log( res );
        }
        else {
            table.push( Object.keys(tableDef).map(i=>res[i]) );
            console.log( table.toString() );
        }
    })
    .catch(function(e) {
        logger('error', e.response.body.message);
    });

}
