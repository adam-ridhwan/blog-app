import crypto from 'crypto';

const length = 5;

export function generateRandomString() {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
