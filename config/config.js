require('dotenv').config();

module.exports = {
  "development": {
    "url": process.env.DATABASE_URI,
    "dialect": "postgres"
  },
  "test": {
    "url": process.env.DATABASE_URI,
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.DATABASE_URI,
    "dialect": "postgres"
  }
}
