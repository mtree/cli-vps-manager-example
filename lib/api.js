const request = require('request-promise');

const apiUrl = 'https://panel.hyperone.com/api/v1/';

module.exports = H1Api;

function H1Api() {
	
}

H1Api.prototype.getApiKey = function(user, password) {
	var options = {
	    method: 'POST',
	    uri: apiUrl + '/user/' + user + '/session',
	    body: {
	        email: user,
	        password: password
	    },
	    json: true
	};

	return request(options);
}