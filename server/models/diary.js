const db = require('../config/db')

exports.findAllDiaries = async (page = 1, pageSize = 10, searchKey = '') => {
  const offset = (page - 1) * pageSize
  try {
    let query = `
      SELECT diary.*, users.nickname, users.avatar
      FROM diary
      LEFT JOIN users ON diary.user_id = users.id
      WHERE 1=1
    `
    const params = []

    if (searchKey) {
      query += ` AND (diary.title LIKE ? OR users.nickname LIKE ?)`
      params.push(`%${searchKey}%`, `%${searchKey}%`)
    }

    query += ' ORDER BY diary.id ASC LIMIT ? OFFSET ?'
    params.push(parseInt(pageSize), parseInt(offset))

    const [rows] = await db.query(query, params)
    return rows
  } catch (error) {
    console.error('查询日记列表失败:', error)
    throw error
  }
}