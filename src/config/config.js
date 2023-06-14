const env = process.env.NODE_ENV || 'dev'

const envs = {
  dev: '.env',
  test: '.env.test'
};

const options = {}
options.path = envs[env.trim()]
require('dotenv').config(options);

const config = {
  env,
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
}

module.exports = { config };
