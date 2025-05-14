import React from 'react';
import { SpinLoading } from 'antd-mobile';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.45);
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <SpinLoading color='primary' style={{ '--size': '48px' }} />
      <LoadingText>加载中...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;