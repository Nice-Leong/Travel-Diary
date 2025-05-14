const db = require('../config/db');
const bcrypt = require('bcrypt'); 

exports.getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, nickname, avatar, bio FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.updateUserInfo = async (id, nickname, avatar, bio) => {
  await db.query('UPDATE users SET nickname = ?, avatar = ?, bio = ? WHERE id = ?', [nickname, avatar, bio, id]);
};

exports.changePassword = async (id, oldPassword, newPassword) => {
  const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [id]);

  if (rows.length === 0) {
    console.log('用户不存在');
    return false;  
  }

  const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
  if (!isMatch) {
    console.log('旧密码错误');
    return false; 
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10); 
  await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

  return true;  
};
