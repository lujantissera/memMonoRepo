import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = (storedHash || '').split(':');
  if (!salt || !hash) {
    return false;
  }
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(hash, 'hex'));
};

export const login = ({ username, password }) => {
  const { AUTH_USERNAME, AUTH_PASSWORD_HASH, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  const validUser = username === AUTH_USERNAME;
  const validPassword = validUser && verifyPassword(password, AUTH_PASSWORD_HASH);

  if (!validUser || !validPassword) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = jwt.sign({ username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '1h',
  });

  return { token };
};
