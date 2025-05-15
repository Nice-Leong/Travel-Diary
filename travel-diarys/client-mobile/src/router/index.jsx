import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
// import Home from '@/views/Home/HomeIndex';

// 懒加载路由组件
const Home = lazy(() => import('@/views/Home/HomeIndex'));
const Detail = lazy(() => import('@/views/Detail/DetailIndex'));
const Login = lazy(() => import('@/views/Login/LoginIndex'));
const MyDiary = lazy(() => import('@/views/MyDiary/MyDiaryIndex'));
const Profile = lazy(() => import('@/views/Profile/ProfileIndex'));
const Publish = lazy(() => import('@/views/Publish/PublishIndex'));

// 懒加载包装器
const lazyLoad = (Component) => (
    <Suspense fallback={<Loading />}>
      {React.createElement(Component)}
    </Suspense>
  );

// 路由守卫 - 检查是否已登录
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  // 需要登录才能访问的路径
  const authRequiredPaths = ['/publish', '/mydiary'];
  
  // 如果访问需要登录的页面且未登录，重定向到登录页
  if (authRequiredPaths.includes(location.pathname) && !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(Login),
  },
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        index: true,
        element: lazyLoad(Home),
      },
      {
        path: 'detail/:id',
        element: lazyLoad(Detail),
      },
      {
        path: 'mydiary',
        element: (
          <RequireAuth>
            {lazyLoad(MyDiary)}
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: lazyLoad(Profile),
      },
      {
        path: 'publish',
        element: (
          <RequireAuth>
            {lazyLoad(Publish)}
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />, // 修改默认重定向到首页
  },
]);
export default router;