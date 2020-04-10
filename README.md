# vault-client-js

```javascript
const VaultClient = require('@happy-travel/vault-client-js').VaultClient;
const VaultOptions = require('@happy-travel/vault-client-js').VaultOptions;


let baseUrl = process.env.HTDC_VAULT_ENDPOINT;
let engine = 'secrets';
let role = 'my-role';

let options = new VaultOptions(baseUrl, engine, role);
let client = new VaultClient(options);

let token = process.env.HTDC_VAULT_TOKEN;
await client.login(token);

let secret = await client.get('my-secret');
```
