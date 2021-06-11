const dotenv = require("dotenv");
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  TOKEN_SECRET,
  EXPIRES_IN,
  PORT,
  MONGODB_URI,
};
