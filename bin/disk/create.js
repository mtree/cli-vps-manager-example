'use strict';

const Cli = require('structured-cli');
const logger = new require('../../lib/logger')();
const Api = require('../../lib/api');
const interactive = require('../../lib/interactive');


const options = {
    name: {
        description: 'Disk name',
        type: 'string',
        defaultValue: () => interactive.prompt('name')
    },
    type: {
        description: 'Disk type Id',
        type: 'string',
        defaultValue: (context) => {

            const profile = context.args.profile;
            const api = new Api(profile);

            return api.get('/service/',{
                public: true,
                resource: 'disk'
            })
            .then( diskOptions => {
                return diskOptions.map(opt => {
                    return {
                        name: opt.name,
                        value: opt._id
                    };
                });
            })
            .then( diskOptions => {
                return interactive.select('type', diskOptions);
            });
        }
    },
    size: {
        description: 'Disk size in GB',
        type: 'int',
        defaultValue: () => interactive.prompt('size (GB)')
    }
};

module.exports = Cli.createCommand('create', {
    description: 'Disk create',
    plugins: [
        require('../_plugins/loginRequired'),
        require('../_plugins/tenantRequired'),
        require('../_plugins/interactiveOptions')
    ],
    options: options,
    handler: handleDiskCreate
});

function handleDiskCreate(args) {

    const api = new Api(args.profile);

    return api.post('/disk/',{
        name: args.name,
        service: args.type,
        size: args.size
    })
    .then(() => logger('info', 'Your disk was successfully created'))
    .catch(e => logger('error', e.response.body.message));
}
