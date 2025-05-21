const jwt = require('jsonwebtoken');
const config = require('../config/env');

   const authMiddleware = (req, res, next) => {

      const publicPaths = [
        { path: '/api/user/login', methods: ['POST'] },
        { path: '/api/user/register', methods: ['POST'] },
        { path: '/api/diary', methods: ['GET'] },
        { path: '/api/detail', methods: ['GET'] }
      ];
    
      // 检查是否是公开路径
      const isPublicPath = publicPaths.some(publicPath => 
        req.path === publicPath.path && 
        publicPath.methods.includes(req.method)
      );
    
      if (isPublicPath) {
        return next();
      }

     try {
       // 从请求头获取token
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ message: '未提供认证token' });
       }

       const token = authHeader.split(' ')[1];
       
       // 验证token
       const decoded = jwt.verify(token, config.jwt.secret);
       
       // 将用户信息添加到请求对象中
       req.user = decoded;
       
       next();
     } catch (error) {
       if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ message: 'token已过期' });
       }
       return res.status(401).json({ message: '无效的token' });
     }
   };

   module.exports = authMiddleware;