require('dotenv').config();

const config = {
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  nodeEnv: process.env.NODE_ENV,
};

export default config;
