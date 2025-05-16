const db = require('../config/db');

exports.createDiary = async ({ title, content, images, video, location, departure_time, days, cost, partner, user_id }) => {
  try {
    const [result] = await db.query(
      `
      INSERT INTO diary (title, content, images, video, location, departure_time, days, cost, partner, user_id, create_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [title, content, JSON.stringify(images), video, location, departure_time, days, cost, partner, user_id]
    );

    return result.insertId;
  } catch (error) {
    console.error('新建日记失败:', error);
    throw error; // 抛出错误由 controller 捕获处理
  }
};
