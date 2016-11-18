'use strict';

const Cli = require('structured-cli');


let category = module.exports = Cli.createCategory('disk', {
    description: 'Manage your disks'
});

category.addChild(require('./disk/create'));
