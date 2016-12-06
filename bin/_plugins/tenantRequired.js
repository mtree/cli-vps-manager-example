'use strict';

const _ = require('lodash');

const configFile = require('../../lib/config');
const logger = new require('../../lib/logger')();

module.exports = {
    onBeforeHandler: context => {
        return configFile.load().then(output => {

            if(_.isEmpty(output.tenant)) {
                logger('info', 'You need to select tenant before you can manage your resources');
                return process.exit(-1); //TODO find a better way
            }
            context.args.profile = output;
            context.args.tenant = output.tenant;
        });
    }
};
