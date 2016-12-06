'use strict';

const Cli = require('structured-cli');

const category = module.exports = Cli.createCategory('disk', {
    description: 'Manage your disks'
});

category.addChild(require('./create'));
category.addChild(require('./list'));
category.addChild(require('./show'));
