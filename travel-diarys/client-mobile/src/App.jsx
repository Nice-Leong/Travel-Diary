import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const location = useLocation();
  
  // 可以根据路由位置添加不同的页面级别样式
  const isAuthPage = location.pathname === '/login';

  return (
    <div className={`app ${isAuthPage ? 'auth-page' : ''}`}>
      {/* RouterProvider 会自动根据路由配置渲染相应的组件 */}
      {/* 这里不需要额外的内容，路由内容会自动注入 */}
    </div>
  );
}

export default App;