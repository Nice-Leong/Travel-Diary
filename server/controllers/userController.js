const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    const user = await userModel.findByUsername(username)
    if (user) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    // 使用 bcrypt 加密密码
    const hash = await bcrypt.hash(password, 10)
    await userModel.createUser(username, hash)
    res.json({ message: '注册成功' })
  } catch (error) {
    res.status(500).json({ message: '服务器错误' })
  }
}


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    const user = await userModel.findByUsername(username)

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const token = jwt.sign({ userId: user.id }, '你的JWT密钥', { expiresIn: '24h' })

    res.json({
      token,
      userInfo: { id: user.id, username: user.username }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}