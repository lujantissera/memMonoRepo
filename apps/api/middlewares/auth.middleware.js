import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token no provisto');
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    throw new ApiError(403, 'Token inválido o expirado');
  }
};

export default authMiddleware;
