'use strict';

const request = require('superagent');
const cookie = require('cookie');
const _ = require('lodash');

const configFile = require('./config');

const apiUrl = 'https://example.xzc.pl/v1';


module.exports = MApi;

function MApi(profile={}) {
    this.apiKey = profile.apiKey;
    this.tenant = profile.tenant;
}

MApi.prototype.getApiKey = function(user, password) {
    return this.post(`/user/${user}/session`, {
        password: password
    });
};

MApi.prototype.getTenants = function() {
    return this.get('/tenant/');
};

const saveCookie = rsp => {
    const setCookie = rsp.headers['set-cookie'];
    if (setCookie) {
        setCookie
            .map(c => cookie.parse(c))
            .filter(c => c['x-auth-token'])
            .forEach(c => configFile.storeApiKey(c['x-auth-token'], new Date(c.Expires)));
    }
    return rsp;
};



MApi.prototype._api = function(method, uri) {
    const headers = {
        'x-auth-token': this.apiKey,
        'x-billing-tenant': this.tenant
    };

    return request(method, _urlJoin(apiUrl,uri))
        .set( _.omitBy(headers, _.isNil) );
};

MApi.prototype.get = function(uri,query={}) {
    return this._api('get',uri)
        .query(query)
        .then(saveCookie)
        .then(res => res.body);
};

MApi.prototype.post = function(uri, body) {
    return this._api('post',uri)
        .send(body)
        .then(saveCookie)
        .then(res => res.body);
};

function _urlJoin(...parts) {
    const url = require('url');
    const path = require('path');

    const urlObj = url.parse(parts.join('/'));
    ['path','pathname'].forEach(elem => {
        urlObj[elem] = path.normalize(urlObj[elem]);
    });

    return url.format(urlObj);
}
