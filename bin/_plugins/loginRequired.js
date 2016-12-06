'use strict';

const moment = require('moment');
const _ = require('lodash');

const configFile = require('../../lib/config');
const logger = new require('../../lib/logger')();

module.exports = {
    onBeforeHandler: context => {
        return configFile.load().then(output => {
            // Retrieve new apiKey if not exist or outdated
            if(_.isEmpty(output.apiKey) || moment.utc(output.expires).isBefore()) {
                logger('info', 'Please login first');
                return process.exit(-1); //TODO find a better way
            }
            context.args.profile = output;
            context.args.apiKey = output.apiKey;
        });
    }
};
