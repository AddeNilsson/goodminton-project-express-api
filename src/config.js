require('dotenv').config();

const config = {
 jwtSecretKey: process.env.JWT_SECRET_KEY,
 dbUser: process.env.DB_USER,
 dbPassword: process.env.DB_PASSWORD,
};

export default config;
