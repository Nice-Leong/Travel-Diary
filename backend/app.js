require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const travelogRoutes = require('./routes/travelogs');
const pool = require('./config/db');

const app = express();

pool.getConnection()
  .then(conn => {
    conn.release();
    console.log('MySQL连接成功');
    
    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/travelogs', travelogRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: '服务器错误' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`服务已启动，端口 ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MySQL连接失败:', err.message);
    process.exit(1);
  });