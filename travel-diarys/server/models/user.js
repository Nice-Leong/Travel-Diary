const db = require('../config/db')

exports.findByUsername = async (username) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE username = ?', [username])    
    if (!result[0] || result[0].length === 0) {
      return null
    }
    return result[0][0]
  } catch (error) {
    throw error
  }
}

exports.createUser = async (username, password, nickname, avatar) => {
  try {
    const result = await db.query(
      'INSERT INTO users (username, password, nickname, avatar) VALUES (?, ?, ?, ?)',
      [username, password, nickname, avatar]
    );
    return result[0].insertId;
  } catch (error) {
    throw error;
  }
};