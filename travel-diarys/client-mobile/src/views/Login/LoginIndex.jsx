import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Toast, Tabs, ImageUploader } from 'antd-mobile';
import styled from 'styled-components';
import defaultAvatar from '@/assets/img/default-avatar.png';
import { useDispatch } from 'react-redux';  
import { login  } from '@/store/modules/user';  
import { userService } from '@/service/modules/user';  

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
`;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from || '/';
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

  // 登录处理函数
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await userService.login(values);  
      dispatch(login({ token: response.token, userInfo: response.userInfo })); 


      localStorage.setItem('token', response.token); 
      localStorage.setItem('id', response.userInfo.id);
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo));


      Toast.show({
        content: '登录成功！',
        icon: 'success',
      });

      navigate(from, { replace: true });
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

      const payload = {
        ...values,
        avatar: avatar || defaultAvatar
      };

      // 调用 API 进行注册
      await userService.register(payload);  

      // 更新 Redux store
      // dispatch(registerAction({
      //   token: response.token,
      //   userInfo: response.userInfo,
      // }));

      // localStorage.setItem('token', response.token);
      // localStorage.setItem('userInfo', JSON.stringify(response.userInfo));

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
      const errorMsg = err.response?.data?.message || err.message || '注册失败！';
    
      Toast.show({
        content: errorMsg,
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
    return Promise.resolve();
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title='登录' key='login'>
            <FormContainer>
              <Form
                form={loginForm}
                onFinish={handleLogin}
                footer={
                  <Button block type='submit' color='primary' loading={loading} size='large'>
                    登录
                  </Button>
                }
              >
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: '请输入用户名！' }]}
                >
                  <Input placeholder='用户名' clearable />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[{ required: true, message: '请输入密码！' }]}
                >
                  <Input placeholder='密码' type='password' clearable />
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
                  <Button block type='submit' color='primary' loading={loading} size='large'>
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
                      onChange={files => setAvatar(files.length > 0 ? files[0].url : defaultAvatar)}
                      upload={handleImageUpload}
                      showUpload={true}
                      maxCount={1}
                    />
                  </div>
                </AvatarUploader>

                <Form.Item
                  name='nickname'
                  rules={[{ validator: validateNickname }]}
                  validateTrigger='onBlur'
                >
                  <Input placeholder='昵称（至少2个字符）' clearable />
                </Form.Item>

                <Form.Item
                  name='username'
                  rules={[{ validator: validateUsername }]}
                  validateTrigger='onBlur'
                >
                  <Input placeholder='用户名（至少3个字符）' clearable />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[
                    { required: true, message: '请输入密码！' },
                    { min: 6, message: '密码至少6个字符！' }
                  ]}
                >
                  <Input placeholder='密码（至少6个字符）' type='password' clearable />
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
                  <Input placeholder='确认密码' type='password' clearable />
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
