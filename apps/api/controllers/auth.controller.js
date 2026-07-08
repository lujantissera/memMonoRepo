import { login as loginService } from '../services/auth.service.js';
import ApiError from '../utils/apiError.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'username y password son requeridos');
  }

  const result = loginService({ username, password });
  res.status(200).json(result);
};
