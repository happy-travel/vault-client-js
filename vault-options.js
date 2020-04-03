module.exports = class  VaultOptions {
    constructor(baseUrl, engine, role) {
        this._baseUrl = baseUrl;
        this._engine = engine;
        this._role = role;
    }


    get baseUrl() {
        return this._baseUrl;
    }


    get engine() {
        return this._engine;
    }


    get role() {
        return this._role;
    }
}