import React from 'react';
import { SafeArea } from 'antd-mobile';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import styled from 'styled-components';

const StyledLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  flex: 1;
  padding: 8px;
  padding-bottom: calc(60px + 16px);
`;

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/detail/'); // 详情页隐藏

  return (
    <StyledLayout>
      <StyledContent>
        <Outlet />
      </StyledContent>
      {!hideNavbar && <Navbar />}
      <SafeArea position='bottom' />
    </StyledLayout>
  );
};

export default AppLayout;