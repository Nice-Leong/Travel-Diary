const users = require('../config/users.json');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }
  
  const token = jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'travel-key', 
    { expiresIn: '1h' }
  );
  
  res.json({ 
    token, 
    user: { 
      username: user.username, 
      role: user.role 
    } 
  });
};