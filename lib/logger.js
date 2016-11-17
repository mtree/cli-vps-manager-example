const Winston = require('winston');

module.exports = Logger;

function Logger() {
	let log;
	switch(process.env.NODE_ENV) {
		case 'dev':
			Winston.level = 'debug';
		default:
			log = Winston.log;
	}
	return log;
}
