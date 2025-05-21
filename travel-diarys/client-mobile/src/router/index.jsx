import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { Toast } from 'antd-mobile';

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
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  // 需要登录才能访问的路径
  const authRequiredPaths = ['/publish', '/mydiary'];
  
  useEffect(() => {
    const checkAuth = async () => {
      if (authRequiredPaths.includes(location.pathname)) {
        if (!token) {
          // 没有token，重定向到登录页
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        try {
          // 验证token是否有效
          const response = await fetch('http://localhost:3000/api/user/verify-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            // token无效或过期，清除token并重定向到登录页
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            Toast.show({
              content: '登录已过期，请重新登录',
              icon: 'fail'
            });
            navigate('/login', { state: { from: location.pathname } });
          }
        } catch (error) {
          console.error('验证token失败:', error);
          // 发生错误时，清除token并重定向到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          Toast.show({
            content: '登录已过期，请重新登录',
            icon: 'fail'
          });
          navigate('/login', { state: { from: location.pathname } });
        }
      }
    };

    checkAuth();
  }, [location.pathname, token, navigate, authRequiredPaths]);
  
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
    element: <Navigate to="/" replace />, 
  },
]);
export default router;