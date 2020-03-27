import jwt from 'jsonwebtoken';
import config from '../config';

const requireAuth = (req, res, next) => {
  // get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization']; // eslint-disable-line

  // if no token found, return error res
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    // if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, config.jwtSecretKey);
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(400).send('Invalid token.');
  }
  return false;
};

export default requireAuth;
