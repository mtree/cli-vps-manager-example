var Bluebird = require('bluebird');
var request = require('superagent-promise')(require('superagent'), Bluebird);

const apiUrl = 'https://api.hyperone.com/v1/';

module.exports = H1Api;

function H1Api() {
	
}

H1Api.prototype.getApiKey = function(user, password) {
	let options = {
	    uri: apiUrl + 'user/' + user + '/session',
	    body: {
	        email: user,
	        password: password
	    }
	};

	return request.post(options.uri)
		.set('Content-Type', 'application/json')
		.send(options.body)
		.end();
}

H1Api.prototype.getTenants = function(apiKey) {
	let options = {
		uri: apiUrl + 'tenant/'
	};

	return request.get(options.uri)
		.set('Content-Type', 'application/json')
		.set('x-auth-token', apiKey)
		.end()
}