# plus.nodetoken
The simplest secure token. Node.js crypto and base64url based.

```javascript
const Cipher = require('plus.nodetoken');

const cipher = Cipher({
  secret: '',
  encryption: 'aes256',
  hmac: 'sha256',
  saltBytes: 4
});

cipher.encrypt({hey: 'here'})
  .then((token) => {
    console.log({token});
    return cipher.decrypt(token)
  })
  .then((data) => {
    console.log(data)
  });

// { token: 'nWq8JzGvoNR_YXR5mEHm2-evjIhVqMHHBHIxPgngoaY.TkEdV4K3JGnzoskzSklPqP11u89KsyxZ5XZhJwDOPV8' }
// { hey: 'here' }
```