import { createSlice } from '@reduxjs/toolkit';
import defaultAvatar from '@/assets/img/default-avatar.png';
import { userService } from '@/service/modules/user';

const safeParseJSON = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    return JSON.parse(value);
  } catch (e) {
    console.warn(`localStorage 解析 ${key} 出错，使用默认值`, e);
    return defaultValue;
  }
};

// 默认用户信息
const defaultUserInfo = {
  id: null,
  nickname: '游客',
  avatar: defaultAvatar,
  bio: '请登录查看完整信息'
};

// 初始化 state
const initialState = {
  token: localStorage.getItem('token') || '',
  userInfo: safeParseJSON('userInfo', defaultUserInfo)
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
    },
    register: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.token = '';
      state.userInfo = {};
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
});

export const { login, register, logout } = userSlice.actions;

// 验证token的异步action
export const verifyToken = () => async (dispatch) => {
  try {
    await userService.verifyToken();
  } catch (error) {
    dispatch(logout());
    throw error;
  }
};

export default userSlice.reducer;
