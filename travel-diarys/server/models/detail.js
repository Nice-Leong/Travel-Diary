const db = require('../config/db');

exports.findDiaryById = async (id) => {
    const [rows] = await db.query(`
      SELECT diary.*, users.nickname, users.avatar
      FROM diary
      LEFT JOIN users ON diary.user_id = users.id
      WHERE diary.id = ?
    `, [id]);
  
    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return null;  // 明确返回 null
    }
  };
  