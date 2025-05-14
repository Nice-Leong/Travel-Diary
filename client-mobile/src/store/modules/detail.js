import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { detailService } from '@/service/modules/detail';

const initialState = {
  detail: null,
  loading: false,
  error: null
};

// 异步获取日记详情
export const fetchDiaryDetail = createAsyncThunk(
  'detail/fetchDiaryDetail',
  async (id, thunkAPI) => {
    try {
      const data = await detailService.getDiaryDetail(id);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '加载失败');
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    clearDiaryDetail(state) {
      state.detail = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDiaryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiaryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchDiaryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDiaryDetail } = detailSlice.actions;

export default detailSlice.reducer;