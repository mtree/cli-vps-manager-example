const Bluebird = require('bluebird');
const Cli = require('structured-cli');
const Fs = Bluebird.promisifyAll(require('fs'));
const logger = new require('./logger')();
const Path = require('path');
const _ = require('lodash');

module.exports = ConfigFile;


function ConfigFile (configPath) {
    if (!configPath) {
        let homePath = process.env[(process.platform == 'win32')
                ? 'USERPROFILE'
                : 'HOME'
            ];
        configFilePath = Path.join(homePath, '.h1conf');
    }
    
    this.configFilePath = configFilePath;
    this.config = null;
}

ConfigFile.prototype.load = function() {
    let readFile = Bluebird.promisify(Fs.readFile, Fs);

    if (_.isNull(this.config)) {
        this.config = readFile(this.configFilePath, 'utf-8')
            .then(Bluebird.method(JSON.parse))
            .then(function(cfg) {
                // parse config
                return cfg;
            })
            .catch(function(e) {
                logger('error', e.message);
                throw e;
            });
    }

    return this.config;
}
