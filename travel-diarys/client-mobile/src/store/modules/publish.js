import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publishService } from '@/service/modules/publish';

const initialState = {
  publishSuccess: false,
  loading: false,
  error: null
};

// 异步发布游记
export const publishDiary = createAsyncThunk(
  'publish/publishDiary',
  async (data, thunkAPI) => {
    try {
      const result = await publishService.publishDiary(data);
      return result;
    } catch (err) {
      console.error('发布失败:', err.message || err);
      return thunkAPI.rejectWithValue(err.message || '发布失败');
    }
  }
);

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    resetPublishState(state) {
      state.publishSuccess = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(publishDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.publishSuccess = false;
      })
      .addCase(publishDiary.fulfilled, (state) => {
        state.loading = false;
        state.publishSuccess = true;
      })
      .addCase(publishDiary.rejected, (state, action) => {
        state.loading = false;
        state.publishSuccess = false;
        state.error = action.payload;
      });
  }
});

export const { resetPublishState } = publishSlice.actions;

export default publishSlice.reducer;
