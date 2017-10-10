const Cipher = require('./index');

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


