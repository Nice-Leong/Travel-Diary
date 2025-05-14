const pool = require('../config/db');

class Diary {
  static async create(diaryData) {
    const [result] = await pool.query(
      `INSERT INTO diary 
      (title, content, author_nickname, status, reject_reason, isDeleted) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        diaryData.title,
        diaryData.content,
        diaryData.author_nickname,
        diaryData.status || 'pending',
        diaryData.reject_reason || null,
        diaryData.isDeleted || false
      ]
    );
    return { ...diaryData, id: result.insertId };
  }

  static async find(query = {}) {
    let sql = `SELECT id, title, content, author_nickname, status, 
              reject_reason, isDeleted, create_time 
              FROM diary WHERE isDeleted = false`;
    const params = [];
    
    if (query.status && query.status !== 'all') {
      sql += ' AND status = ?';
      params.push(query.status);
    }
    
    sql += ' ORDER BY create_time DESC';
    
    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = Diary;