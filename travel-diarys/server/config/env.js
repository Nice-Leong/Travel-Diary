require('dotenv').config();

const requiredEnvVars = ['JWT_SECRET', 'JWT_EXPIRES_IN'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`缺少必要的环境变量: ${missingEnvVars.join(', ')}`);
}


module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
};