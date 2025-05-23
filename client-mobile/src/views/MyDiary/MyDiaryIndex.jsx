import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, Dialog } from 'antd-mobile';
import { useDispatch } from 'react-redux';
import { fetchTravelNotes, deleteTravelNote } from '@/store/modules/mydiary';
import styled from 'styled-components';
import { mockData } from '@/mock/travelNotes';

const PageContainer = styled.div`
  // background: #f5f6fa;
  min-height: 100vh;
  padding: 0 0 16px 0;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  background: #fff;
`;

const AddBtn = styled.span`
  color: #1677ff;
  font-size: 18px;
  cursor: pointer;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  margin: 10px 8px 0 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #1677ff; 
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
`;

const CardRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Cover = styled.img`
  width: 100px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
  background: #f5f5f5;
`;

const Info = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Desc = styled.div`
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
  flex-wrap: wrap
`;

const StatusBtn = styled.div`
  padding: 4px 18px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'approved'
      ? '#e6f7e6'
      : $status === 'pending'
      ? '#fffbe6'
      : '#fff1f0'};
  color: ${({ $status }) =>
    $status === 'approved'
      ? '#52c41a'
      : $status === 'pending'
      ? '#faad14'
      : '#ff4d4f'};
  border: none;
  display: inline-block;
`;

const Reason = styled.div`
  color: #ff4d4f;
  font-size: 13px;
  margin-left: 8px;
`;

const ActionBtn = styled.button`
  border: 1px solid #1677ff;
  color: #1677ff;
  background: #fff;
  border-radius: 6px;
  padding: 4px 18px;
  font-size: 15px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e6f4ff;
  }
`;

const MyDiary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { list } = useSelector(state => state.diary);
  // const username = localStorage.getItem('username');

  // 只展示当前用户的游记
  const myList = mockData.filter(item => item.author?.nickname === 'testuser');
  // console.log('myList', myList);

  useEffect(() => {
    dispatch(fetchTravelNotes());
  }, [dispatch]);

  // 删除
  const handleDelete = async (id) => {
    Dialog.confirm({
      content: '确定要删除这条游记吗？',
      onConfirm: async () => {
        await dispatch(deleteTravelNote(id));
        Toast.show({ content: '删除成功', icon: 'success' });
      }
    });
  };

  // 编辑
  const handleEdit = (id) => {
    navigate(`/publish?id=${id}&from=mydiary`);
  };

  return (
    <PageContainer>
      <Header>
        <span>我的游记</span>
        <AddBtn onClick={() => navigate('/publish')}>+ 新增</AddBtn>
      </Header>
      {myList.map(item => (
        <Card key={item.id}>
          <CardRow>
            <Cover src={item.images?.[0]} />
            <Info>
              <Title>{item.title}</Title>
              <Desc>{item.content}</Desc>
            </Info>
          </CardRow>
          <StatusRow>
            <StatusBtn $status={item.status}>
              {item.status === 'approved'
                ? '已通过'
                : item.status === 'pending'
                ? '待审核'
                : '未通过'}
            </StatusBtn>
            <div style={{ flex: 1 }} />
            <ActionBtn onClick={() => handleDelete(item.id)}>删除</ActionBtn>
            {(item.status === 'pending' || item.status === 'rejected') && (
              <ActionBtn onClick={() => handleEdit(item.id)}>编辑</ActionBtn>
            )}
            {item.status === 'rejected' && item.rejectReason && (
              <Reason>原因：{item.rejectReason}</Reason>
            )}
          </StatusRow>
        </Card>
      ))}
    </PageContainer>
  );
};

export default MyDiary;