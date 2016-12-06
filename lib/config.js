'use stict';

const Bluebird = require('bluebird');
const Fs = Bluebird.promisifyAll(require('fs'));
const logger = new require('./logger')();
const Path = require('path');
const _ = require('lodash');

function ConfigFile (configPath) {
    if (!configPath) {
        const homePath = process.env[(process.platform === 'win32')
                ? 'USERPROFILE'
                : 'HOME'
            ];
        configPath = Path.join(homePath, '.mtreeconf');
    }

    this.configFilePath = configPath;
    this.config = null;
}

ConfigFile.prototype.load = function() {
    const readFile = Bluebird.promisify(Fs.readFile, Fs);

    if (_.isNull(this.config)) {
        this.config = readFile(this.configFilePath, 'utf-8')
            .then(Bluebird.method(JSON.parse))
            .then(function(cfg) {
                // parse config
                return cfg;
            })
            .catch(e => {
                if (e.code === 'ENOENT') {
                    logger('warn', 'Config file not found. Creating one in your home directory.');
                    _saveConfig(this.configFilePath, {});

                    return {};
                } else {
                    throw e;
                }
            });
    }

    return this.config;
};

ConfigFile.prototype.storeApiKey = function(apiKey, expires) {
    return this.store({
        apiKey: apiKey,
        expires: expires
    });
};

ConfigFile.prototype.storeTenant = function(tenantId) {
    return this.store({ tenant: tenantId });
};

ConfigFile.prototype.store = function(obj) {
    return this.load().then((config) => {
        Object.assign(config, obj);
        return _saveConfig(this.configFilePath, config);
    });
};

// Helper functions
function _saveConfig(configLocation, obj) {
    return Fs.writeFileAsync(configLocation, JSON.stringify(obj, null, 2), 'utf-8');
}

module.exports = new ConfigFile();
