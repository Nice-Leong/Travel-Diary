import React from 'react';
import { TabBar } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  HomeOutlined,
  EditOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';

const StyledTabBar = styled(TabBar)`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  
  .adm-tab-bar-item {
    color: #999;
    &-active {
      color: #1677ff;
    }
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <HomeOutlined />,
    },
    {
      key: '/publish',
      title: '发布游记',
      icon: <EditOutlined />,
    },
    {
      key: '/my-diary',
      title: '我的游记',
      icon: <BookOutlined />,
    },
    {
      key: '/profile',
      title: '个人中心',
      icon: <UserOutlined />,
    },
  ];

  const handleTabChange = (key) => {
    navigate(key);
  };

  return (
    <StyledTabBar
      activeKey={location.pathname}
      onChange={handleTabChange}
    >
      {tabs.map(tab => (
        <TabBar.Item
          key={tab.key}
          icon={tab.icon}
          title={tab.title}
        />
      ))}
    </StyledTabBar>
  );
};

export default Navbar;