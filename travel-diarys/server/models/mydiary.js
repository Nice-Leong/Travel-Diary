const db = require('../config/db'); 

const Diary = {
  async getMyDiaryByUserId(user_id) {
    const [rows] = await db.query('SELECT * FROM diary WHERE user_id = ?', [user_id]);
    return rows;
  },

  async updateDiary(id, title, content, location, departure_time, days, cost, partner, images, video) {
  
    const result = await db.query(
      `UPDATE diary 
       SET title = ?, content = ?, location = ?, departure_time = ?, days = ?, cost = ?, partner = ?, images = ?, video = ? 
       WHERE id = ?`,
      [ title, content, location, departure_time, days, cost, partner, JSON.stringify(images), video, id ]
    );
  
    if (result.affectedRows === 0) return null;
  
    return { id, title, content, location, departure_time, days, cost, partner, images, video };
  },
  

  async deleteDiary(id) {
    const result = await db.query('DELETE FROM diary WHERE id = ?', [id]);
    return result.affectedRows > 0; 
  }
};

module.exports = Diary;
