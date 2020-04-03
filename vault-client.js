const fetch = require('node-fetch');


module.exports = class VaultClient {
    constructor(options = new VaultOptions()) {
        this.options = options;
    }


    async _getData(url, method, data) {
        let content = await this._makeRequest(url, method, data);
        if (content.data === undefined || content.data === null)
            throw 'The vault response has no data';
    
        return content.data;
    }
    
    
    async _getRoleId() {
        let url = `auth/approle/role/${this.options.role}/role-id`;
        let data = await this._getData(url, 'GET');
    
        return data.role_id;
    }
    
    
    async _getSecretId() {
        let url = `auth/approle/role/${this.options.role}/secret-id`;
        let data = await this._getData(url, 'POST');
    
        return data.secret_id;
    }
    
    
    async _getToken(roleId, secretId) {
        const url = 'auth/approle/login';
        
        let content = await this._makeRequest(url, 'POST', {
            role_id: roleId,
            secret_id: secretId
        });
        if (content.auth === undefined || content.auth === null)
            throw 'The vault response has no auth data';
    
        return content.auth.client_token;
    }
    
    
    async _makeRequest(url, method, data) {
        if (this.token === undefined || this.token === null )
            throw 'A token isn\'t set';
        
        let options =  {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'X-Vault-Token': this.token
            }
        };
    
        if (method === 'POST') {
            if  (data !== undefined && data !== null)
                options.body = JSON.stringify(data);
        }
    
        let absoluteUrl = `${this.options.baseUrl}${url}`;
        let response = await fetch(absoluteUrl, options);
        
        let content = await response.json();
        if (content === null)
            throw 'The vault response has no content';
    
        return content;
    }


    async get(secretKey) {
        let url = `${this.options.engine}/data/${secretKey}`;
        let data = await this._getData(url, 'GET');

        return data.data;
    }


    async login(token) {
        this.token = token;

        let roleId = await this._getRoleId();
        let secretId = await this._getSecretId();
        let roleToken = await this._getToken(roleId, secretId);

        this.token = roleToken;
    }
}