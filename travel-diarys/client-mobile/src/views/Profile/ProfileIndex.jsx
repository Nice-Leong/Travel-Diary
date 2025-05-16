import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, Toast, Input, TextArea, Button, ImageUploader } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { fetchUserInfo, updateUserInfo, changePassword, logout } from '@/store/modules/profile';
import defaultAvatar from '@/assets/img/default-avatar.png';

const ProfileContainer = styled.div`
  
  height: 100vh;
  padding: 10px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  
  padding: 24px 16px 20px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f5f5f5;
  margin-bottom: 16px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Nickname = styled.div`
  height: 30px;
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
`;

const Username = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 6px;
`;

const Bio = styled.div`
  font-size: 15px;
  color: #666;
  height: 100px;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionBtn = styled(Button)`
  width: 100%;
`;

const AvatarUploader = styled.div`
  margin-bottom: 12px;
  
  .avatar-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    
    &:hover::after {
      content: '点击更换头像';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
  }

  .default-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PageContainer = styled.div`
  height: 100vh;
  padding: 10px;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  padding: 48px;
  color: #333;
`;

const DefaultProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const LoginBtn = styled(Button)`
  margin-top: 20px;
  width: 60%;
`;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector(state => state.profile.userInfo);
  const { loading, error } = useSelector(state => state.profile);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await dispatch(fetchUserInfo(id)).unwrap();
        } catch (error) {
          console.error(error);
        }
      } 
    };

    fetchData();
  }, [dispatch, id]);

  // 如果未登录，显示默认信息
  if (!token) {
    return (
      <PageContainer>
        <Header>
          <span>未登录</span>
        </Header>
        <DefaultProfile>
          <Avatar src={defaultAvatar} />
          <Nickname>旅客</Nickname>
          <LoginBtn onClick={() => navigate('/login', { state: { from: '/profile' } })}>
            登录/注册
          </LoginBtn>
        </DefaultProfile>
      </PageContainer>
    );
  }


  const handleImageUpload = async (file) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ url: reader.result });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (err) {
      Toast.show({ content: err.message || '图片上传失败', icon: 'fail' });
      return null;
    }
  };

  const handleEdit = async () => {
    if (!user) return;

    let newNickname = user.nickname;
    let newBio = user.bio;
    let newAvatar = user.avatar;

    // 创建一个隐藏的文件输入元素
    const fileInputRef = React.createRef();

    await Dialog.confirm({
      title: '编辑个人信息',
      content: (
        <div>
          <AvatarUploader>
            <div 
              className="avatar-wrapper"
              onClick={() => {
                // 点击头像时触发文件选择
                fileInputRef.current?.click();
              }}
            >
              <img 
                src={newAvatar || defaultAvatar} 
                alt="当前头像" 
                className="default-avatar"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const result = await handleImageUpload(file);
                      if (result) {
                        newAvatar = result.url;
                        // 强制更新预览图
                        const img = document.querySelector('.default-avatar');
                        if (img) {
                          img.src = result.url;
                        }
                      }
                    } catch (err) {
                      Toast.show({ content: err.message || '图片上传失败', icon: 'fail' });
                    }
                  }
                  // 清空文件输入，允许重复选择同一文件
                  e.target.value = '';
                }}
              />
            </div>
          </AvatarUploader>
          <Input
            defaultValue={user.nickname}
            placeholder="请输入昵称"
            onChange={val => (newNickname = val)}
            style={{ marginBottom: 12 }}
          />
          <TextArea
            defaultValue={user.bio || ''}
            placeholder="请输入个人简介"
            rows={3}
            onChange={val => (newBio = val)}
          />
        </div>
      ),
      onConfirm: async () => {
        try {
          // 确保头像 URL 有效
          if (!newAvatar || newAvatar === defaultAvatar) {
            newAvatar = defaultAvatar;
          }
          
          await dispatch(updateUserInfo({ 
            id: user.id, 
            data: { 
              nickname: newNickname, 
              bio: newBio, 
              avatar: newAvatar 
            } 
          }));

          // 更新本地存储的用户信息
          const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          const updatedUserInfo = { 
            ...currentUserInfo, 
            nickname: newNickname,
            bio: newBio,
            avatar: newAvatar
          };
          localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
          
          Toast.show({ content: '修改成功', icon: 'success' });
        } catch (err) {
          Toast.show({ content: err.message || '修改失败', icon: 'fail' });
        }
      }
    });
  };

  const handleChangePwd = async () => {
    let oldPwd = '';
    let newPwd = '';
    let confirmPwd = '';

    await Dialog.confirm({
      title: '修改密码',
      content: (
        <div>
          <Input
            placeholder="请输入原密码"
            type="password"
            onChange={val => (oldPwd = val)}
            style={{ marginBottom: 12 }}
          />
          <Input
            placeholder="请输入新密码"
            type="password"
            onChange={val => (newPwd = val)}
            style={{ marginBottom: 12 }}
          />
          <Input
            placeholder="请确认新密码"
            type="password"
            onChange={val => (confirmPwd = val)}
          />
        </div>
      ),
      onConfirm: async () => {
        if (!oldPwd || !newPwd || !confirmPwd) {
          Toast.show({ content: '请填写所有字段', icon: 'fail' });
          return Promise.reject();
        }

        if (newPwd !== confirmPwd) {
          Toast.show({ content: '两次新密码不一致', icon: 'fail' });
          return Promise.reject();
        }

        try {
          await dispatch(changePassword({ id: user.id, data: { oldPassword: oldPwd, newPassword: newPwd } }));
          Toast.show({ content: '密码修改成功', icon: 'success' });
        } catch (e) {
          Toast.show({ content: e.message || '密码修改失败', icon: 'fail' });
        }
      }
    });
  };

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        dispatch(logout());
        window.location.href = '/login';
      }
    });
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败：{error}</div>;
  if (!user) return null;

  return (
    <ProfileContainer>
      <Card>
        <TopSection>
          <Avatar src={user.avatar || defaultAvatar} alt="" />
          <InfoBlock>
            <Nickname>{user.nickname || '用户昵称'}</Nickname>
            <Bio>{user.bio || '这个人很懒，什么都没有写~'}</Bio>
          </InfoBlock>
        </TopSection>
        <BtnGroup>
          <ActionBtn color="primary" onClick={handleEdit}>编辑信息</ActionBtn>
          <ActionBtn color="primary" onClick={handleChangePwd}>修改密码</ActionBtn>
          <ActionBtn color="danger" onClick={handleLogout}>退出登录</ActionBtn>
        </BtnGroup>
      </Card>
    </ProfileContainer>
  );
};

export default Profile;
