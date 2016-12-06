'use strict';

const Bluebird = require('bluebird');

module.exports = {
    onBeforeHandler: context => {
        return Bluebird.resolve(
            // TODO: better way to determine which function to execute
            Object.keys(context.args)
            .filter(arg => ( /^[^\$]/.test(arg) && typeof context.args[arg] === 'function') )
        )
        .mapSeries(arg => {
           return new Promise( (resolve, reject) => {
                context.args[arg](context)
                .then(prompt => {
                    context.args[arg] = prompt.value;
                    resolve();
                })
                .catch(reject);
            });
        });
    }
};
