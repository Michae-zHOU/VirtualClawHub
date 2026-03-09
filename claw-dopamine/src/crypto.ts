import crypto from 'node:crypto';

export function b64url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function randomCode(bytes = 24) {
  return b64url(crypto.randomBytes(bytes));
}

export function sha256Base64Url(data: string | Buffer) {
  const h = crypto.createHash('sha256');
  h.update(data);
  return b64url(h.digest());
}
