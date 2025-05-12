import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, Toast, Input, TextArea, Button, ImageUploader } from 'antd-mobile';
import defaultAvatar from '../../assets/img/default-avatar.png';

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
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo') || '{}') || {
      avatar: defaultAvatar,
      nickname: '未登录',
      username: '未登录',
      bio: '这个人很懒，什么都没有写~'
    };
  });

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
      Toast.show({
        content: err.message || '图片上传失败',
        icon: 'fail',
      });
      return null;
    }
  };

  const handleEdit = async () => {
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
                value={newAvatar && newAvatar !== defaultAvatar ? [{ url: newAvatar }] : []}
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
      onConfirm: () => {
        setUser(u => {
          const updated = { ...u, nickname: newNickname, bio: newBio, avatar: newAvatar };
          localStorage.setItem('userInfo', JSON.stringify(updated));
          Toast.show({ content: '修改成功', icon: 'success' });
          return updated;
        });
      }
    });
  };

  const handleChangePwd = async () => {
    let oldPwd = '';
    let newPwd = '';
    let confirmPwd = '';
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const savedPassword = userInfo.password || ''; // 假设密码保存在这里
  
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
      onConfirm: () => {
        if (!oldPwd || !newPwd || !confirmPwd) {
          Toast.show({ content: '请填写所有字段', icon: 'fail' });
          return Promise.reject();
        }
  
        if (oldPwd !== savedPassword) {
          Toast.show({ content: '原密码错误', icon: 'fail' });
          return Promise.reject();
        }
  
        if (newPwd !== confirmPwd) {
          Toast.show({ content: '两次新密码不一致', icon: 'fail' });
          return Promise.reject();
        }
  
        // 更新密码并存入 localStorage
        const updated = { ...userInfo, password: newPwd };
        localStorage.setItem('userInfo', JSON.stringify(updated));
        Toast.show({ content: '密码修改成功', icon: 'success' });
      }
    });
  };

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    });
  };

  return (
    <ProfileContainer>
      <Card>
        <TopSection>
          <Avatar src={user.avatar || defaultAvatar} alt="" />
          <InfoBlock>
            <Nickname>{user.nickname || '未登录'}</Nickname>
            {/* <Username>用户名：{user.username}</Username> */}
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
