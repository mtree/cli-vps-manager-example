const request = require('request-promise');

const apiUrl = 'https://api.hyperone.com/v1/';

module.exports = H1Api;

function H1Api() {
	
}

H1Api.prototype.getApiKey = function(user, password) {
	let options = {
	    method: 'POST',
	    uri: apiUrl + 'user/' + user + '/session',
	    body: {
	        email: user,
	        password: password
	    },
	    json: true
	};

	return request(options);
}