const crypto = require('crypto');
const base64url = require('base64url');


class Cipher {
  constructor(options = {}) {
    this.options = Object.assign({
      secret: '',
      encryption: 'aes256',
      hmac: 'sha256',
      saltBytes: 4
    }, options);
  }

  encrypt(data) {
    return Promise.resolve()
      .then(() => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(this.options.saltBytes, (err, buf) => {
            if (err) return reject(err);
            resolve(base64url.fromBase64(buf.toString('base64')));
          });
        })
      })
      .then((salt) => {
        const cipher = crypto.createCipher(this.options.encryption, this.options.secret);

        let encrypted = cipher.update(`${salt}.${JSON.stringify(data)}`, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return base64url.fromBase64(Buffer.from(encrypted, 'hex').toString('base64'));
      })
      .then((encrypted) => {
        const hmac = crypto.createHmac(this.options.hmac, this.options.secret);
        hmac.update(encrypted);

        const sign = base64url.fromBase64(hmac.digest('base64'));

        return `${encrypted}.${sign}`;
      })
  }

  decrypt(token) {
    return Promise.resolve()
      .then(() => {
        const parts = ('' + token).split('.');

        if (parts && parts.length !== 2) {
          return Promise.reject(new Error('Invalid token parts'));
        }

        const [payload, sign] = parts;

        const hmac = crypto.createHmac(this.options.hmac, this.options.secret);
        hmac.update(payload);

        const expectedSign = base64url.fromBase64(hmac.digest('base64'));

        if (expectedSign !== sign) {
          return Promise.reject(new Error('Invalid signature'));
        } else {
          return payload;
        }

      })
      .then((payload) => {
        if (!payload) {
          return Promise.reject(new Error('Invalid payload'))
        }

        const decipher = crypto.createDecipher(this.options.encryption, this.options.secret);

        let encrypted = base64url.toBuffer(payload).toString('hex', 'utf8');
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        decrypted = decrypted.replace(/^[^.]*\./igm, '');
        return decrypted;
      })
      .then((textJson) => JSON.parse(textJson))
  }
}


module.exports = (options = {}) => new Cipher(options)
