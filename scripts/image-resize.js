const crypto = require('crypto')

const KEY = process.env.IMAGE_KEY;
const SALT = process.env.IMAGE_HASH;
const resizing_type = 'fill'
const width = 1200
const height = 400
const gravity = 'no'
const enlarge = 1
const extension = 'png'


const urlSafeBase64 = (string) => {
  return new Buffer(string).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret) => {
  const hmac = crypto.createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}

exports.resize_header = (urlParam) => {
	let url = urlParam;
	const encoded_url = urlSafeBase64(url);
	const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`;

	const signature = sign(SALT, path, KEY);
	const result = `/${signature}${path}`;
	return result;
}



