import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '@/service/modules/profile';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

// 异步获取用户信息
export const fetchUserInfo = createAsyncThunk(
  'profile/fetchUserInfo',
  async (id, thunkAPI) => {
    try {
      const data = await profileService.getUserInfo(id);
      
      // 检查数据格式
      if (data && typeof data === 'object') {
        return data;
      }
      throw new Error('返回数据格式不正确');
    } catch (err) {
      console.error('[DEBUG] Redux - 获取用户信息失败:', err);
      return thunkAPI.rejectWithValue(err.message || '获取用户信息失败');
    }
  }
);

// 异步更新用户信息
export const updateUserInfo = createAsyncThunk(
  'profile/updateUserInfo',
  async ({ id, data }, thunkAPI) => {
    try {
      await profileService.updateUserInfo(id, data);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '更新用户信息失败');
    }
  }
);

// 异步修改密码
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ id, data }, thunkAPI) => {
    try {
      await profileService.updatePassword(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '修改密码失败');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('userInfo');
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户信息
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          ...action.payload
        };
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 更新用户信息
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 修改密码
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = profileSlice.actions;
export default profileSlice.reducer;
