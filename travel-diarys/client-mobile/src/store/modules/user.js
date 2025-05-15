import { createSlice } from '@reduxjs/toolkit';
import defaultAvatar from '@/assets/img/default-avatar.png';

const initialState = {
  token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
    id: null,
    nickname: '游客',
    avatar: defaultAvatar,
    bio: '请登录查看完整信息'
  }
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

export default userSlice.reducer;
