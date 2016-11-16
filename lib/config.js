const Bluebird = require('bluebird');
const Cli = require('structured-cli');
const Fs = Bluebird.promisifyAll(require('fs'));
const Winston = require('winston');
const Path = require('path');
const _ = require('lodash');

// TODO: I shall wrap Winston in some abstract class and read ENV var on construct
Winston.level = 'debug';

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
                Winston.log('debug', cfg);
                return cfg;
            })
            .catch(function(e) {
                Winston.log('error', e.message);
                throw e;
            });
    }

    return this.config;
}

var conf = new ConfigFile();
conf.load();
