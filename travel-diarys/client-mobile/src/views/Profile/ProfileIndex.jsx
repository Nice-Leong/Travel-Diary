import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, Toast, Input, TextArea, Button, ImageUploader } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
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
  }

  .default-avatar {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .adm-image-uploader {
    --cell-size: 80px;
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
  }

  .adm-image-uploader-upload-button {
    width: 80px !important;
    height: 80px !important;
    background: transparent;
    border-radius: 50%;
    padding: 0;
    margin: 0;
  }

  .adm-image-uploader-cell {
    width: 80px;
    height: 80px;
    padding: 0;
    margin: 0;
    border-radius: 50%;
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile.userInfo);
  const { loading, error } = useSelector(state => state.profile);
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          await dispatch(fetchUserInfo(id)).unwrap();
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('[DEBUG] Profile组件 - 没有用户ID，无法获取信息');
      }
    };

    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    console.log('[DEBUG] Profile组件 - user数据发生变化:', user);
  }, [user]);

  

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

    await Dialog.confirm({
      title: '编辑个人信息',
      content: (
        <div>
          <AvatarUploader>
            <div className="avatar-wrapper">
              <img src={newAvatar || defaultAvatar} alt="当前头像" className="default-avatar" />
              <ImageUploader
                value={newAvatar ? [{ url: newAvatar }] : []}
                onChange={files => {
                  newAvatar = files.length > 0 ? files[0].url : defaultAvatar;
                }}
                upload={handleImageUpload}
                showUpload={true}
                maxCount={1}
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
            defaultValue={user.bio}
            placeholder="请输入个人简介"
            rows={3}
            onChange={val => (newBio = val)}
          />
        </div>
      ),
      onConfirm: async () => {
        try {
          await dispatch(updateUserInfo({ id: user.id, data: { nickname: newNickname, bio: newBio, avatar: newAvatar } }));
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
