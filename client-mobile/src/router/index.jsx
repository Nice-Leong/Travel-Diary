import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
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
  if (!token) {
    // 如果没有登录，重定向到登录页
    return <Navigate to="/login" replace />;
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
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
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
        path: 'my-diary',
        element: lazyLoad(MyDiary),
      },
      {
        path: 'profile',
        element: lazyLoad(Profile),
      },
      {
        path: 'publish',
        element: lazyLoad(Publish),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
export default router;