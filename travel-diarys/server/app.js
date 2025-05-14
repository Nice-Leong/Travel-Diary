const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()
app.use(cors({
  origin: 'http://localhost:5173', // 明确指定前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的 HTTP 方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  credentials: true // 如果需要跨域传递 cookies
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json())




app.use('/api/user', require('./routes/user'))
app.use('/api/publish', require('./routes/publish'));
app.use('/api/diary', require('./routes/diary'))
app.use('/api/detail', require('./routes/detail'));
app.use('/api/mydiary', require('./routes/mydiary'));
app.use('/api/profile', require('./routes/profile'));



app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})

