import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Toast, Tabs, ImageUploader } from 'antd-mobile';
import styled from 'styled-components';
import defaultAvatar from '@/assets/img/default-avatar.png';

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
`;

const LoginCard = styled.div`
  width: 100%;
  padding: 0 20px;
`;

const FormContainer = styled.div`
  margin-top: 24px;
`;

const AvatarUploader = styled.div`
  margin: 20px auto;
  text-align: center;
  width: 88px;
  
  .avatar-title {
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
  }

  .avatar-wrapper {
    position: relative;
    width: 88px;
    height: 88px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .default-avatar {
    position: absolute;
    width: 88px;
    height: 88px;
    object-fit: cover;
  }

  .adm-image-uploader {
    --cell-size: 88px;
    position: absolute;
    top: 0;
    left: 0;
    width: 88px;
    height: 88px;
  }

  .adm-image-uploader-upload-button {
    width: 88px !important;
    height: 88px !important;
    background: transparent;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }

  .adm-image-uploader-cell {
    width: 88px;
    height: 88px;
    padding: 0;
    margin: 0;
  }
`

const Login = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');

  // 处理图片上传
  const handleImageUpload = async (file) => {
    try {
      // 将文件转换为base64
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

  // 检查用户名是否已存在
  const checkUsername = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.username === username);
  };

  // 检查昵称是否已存在
  const checkNickname = (nickname) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.nickname === nickname);
  };

  // 保存用户信息
  const saveUser = (userInfo) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      ...userInfo,
      avatar: avatar || defaultAvatar,
      nickname: userInfo.nickname || userInfo.username, // 如果没有设置昵称，使用用户名作为昵称
    });
    localStorage.setItem('users', JSON.stringify(users));
  };

  // 登录处理函数
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === values.username);
      
      if (!checkUsername(values.username)) {
        Toast.show({
          content: '用户名不存在！',
          icon: 'fail',
        });
        return;
      }

      if (user.password !== values.password) {
        Toast.show({
          content: '密码错误！',
          icon: 'fail',
        });
        return;
      }

      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('username', values.username);
      
      Toast.show({
        content: '登录成功！',
        icon: 'success',
      });
      
      navigate('/', { replace: true });
      
    } catch (err) {
      Toast.show({
        content: err.message || '登录失败！',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  // 注册处理函数
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        Toast.show({
          content: '两次输入的密码不一致！',
          icon: 'fail',
        });
        return;
      }

      if (checkNickname(values.nickname)) {
        Toast.show({
          content: '昵称已存在！',
          icon: 'fail',
        });
        return;
      }

      if (checkUsername(values.username)) {
        Toast.show({
          content: '用户名已存在！',
          icon: 'fail',
        });
        return;
      }

      // 保存用户信息
      saveUser({
        username: values.username,
        password: values.password,
        avatar: avatar === defaultAvatar ? defaultAvatar : avatar, 
        createTime: new Date().toISOString()
      });
      
      Toast.show({
        content: '注册成功！请登录',
        icon: 'success',
      });

      registerForm.resetFields();
      setAvatar('');
      loginForm.setFieldsValue({
        username: values.username
      });
      setActiveTab('login');
      
    } catch (err) {
      Toast.show({
        content: err.message || '注册失败！',
        icon: 'fail',
      });
    } finally {
      setLoading(false);
    }
  };

  // 用户名验证规则
  const validateUsername = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入用户名！'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('用户名至少3个字符！'));
    }
    if (activeTab === 'register' && checkUsername(value)) {
      return Promise.reject(new Error('用户名已存在！'));
    }
    return Promise.resolve();
  };

  // 昵称验证规则
  const validateNickname = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入昵称！'));
    }
    if (value.length < 2) {
      return Promise.reject(new Error('昵称至少2个字符！'));
    }
    if (checkNickname(value)) {
      return Promise.reject(new Error('昵称已被使用！'));
    }
    return Promise.resolve();
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.Tab title='登录' key='login'>
            <FormContainer>
              <Form
                form={loginForm}
                onFinish={handleLogin}
                footer={
                  <Button
                    block
                    type='submit'
                    color='primary'
                    loading={loading}
                    size='large'
                  >
                    登录
                  </Button>
                }
              >
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: '请输入用户名！' }]}
                >
                  <Input
                    placeholder='用户名'
                    clearable
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[{ required: true, message: '请输入密码！' }]}
                >
                  <Input
                    placeholder='密码'
                    type='password'
                    clearable
                  />
                </Form.Item>
              </Form>
            </FormContainer>
          </Tabs.Tab>
          
          <Tabs.Tab title='注册' key='register'>
            <FormContainer>
              <Form
                form={registerForm}
                onFinish={handleRegister}
                footer={
                  <Button
                    block
                    type='submit'
                    color='primary'
                    loading={loading}
                    size='large'
                  >
                    注册
                  </Button>
                }
              >
                <AvatarUploader>
                  <div className="avatar-title">头像（选填）</div>
                  <div className="avatar-wrapper">
                    <img src={defaultAvatar} alt="默认头像" className="default-avatar" />
                    <ImageUploader
                      value={avatar && avatar !== defaultAvatar ? [{ url: avatar }] : []}
                      onChange={files => {
                        setAvatar(files.length > 0 ? files[0].url : defaultAvatar);
                      }}
                      upload={handleImageUpload}
                      showUpload={true}
                      maxCount={1}
                    />
                  </div>
                </AvatarUploader>

                <Form.Item
                  name='nickname'
                  rules={[
                    { validator: validateNickname }
                  ]}
                  validateTrigger='onBlur'
                >
                  <Input
                    placeholder='昵称（至少2个字符）'
                    clearable
                  />
                </Form.Item>

                <Form.Item
                  name='username'
                  rules={[
                    { validator: validateUsername }
                  ]}
                  validateTrigger='onBlur'
                >
                  <Input
                    placeholder='用户名（至少3个字符）'
                    clearable
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[
                    { required: true, message: '请输入密码！' },
                    { min: 6, message: '密码至少6个字符！' }
                  ]}
                >
                  <Input
                    placeholder='密码（至少6个字符）'
                    type='password'
                    clearable
                  />
                </Form.Item>
                <Form.Item
                  name='confirmPassword'
                  rules={[
                    { required: true, message: '请确认密码！' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致！'));
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder='确认密码'
                    type='password'
                    clearable
                  />
                </Form.Item>
              </Form>
            </FormContainer>
          </Tabs.Tab>
        </Tabs>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;