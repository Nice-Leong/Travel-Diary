import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import router from './router';
import store from './store';
import 'antd-mobile/es/global';

import 'normalize.css';
import '@/assets/css/index.css';

import { initMockData } from './mock/travelNotes';

// 初始化模拟数据
initMockData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
);
