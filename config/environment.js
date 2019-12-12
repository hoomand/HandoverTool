const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION
};
