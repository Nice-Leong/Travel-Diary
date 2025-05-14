import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mydiaryService } from '@/service/modules/mydiary'; 

const initialState = {
  diary: [],
  loading: false,
  error: null,
};

// 异步获取用户游记
export const fetchDiary = createAsyncThunk(
  'mydiary/fetchDiary',
  async (params, thunkAPI) => {
    try {
      const data = await mydiaryService.getMyDiary(params); 
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '加载失败');
    }
  }
);

// 删除游记
export const deleteDiary = createAsyncThunk(
  'mydiary/deleteDiary',
  async (id, thunkAPI) => {
    try {
      await mydiaryService.deleteMyDiary(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '删除失败');
    }
  }
);

// 编辑游记
export const updateDiary = createAsyncThunk(
  'mydiary/updateDiary',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await mydiaryService.updateDiary(id, data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '更新失败');
    }
  }
);

const mydiarySlice = createSlice({
  name: 'mydiary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiary.fulfilled, (state, action) => {
        state.loading = false;
        state.diary = action.payload;
      })
      .addCase(fetchDiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiary.fulfilled, (state, action) => {
        state.loading = false;
        state.diary = state.diary.filter(item => item.id !== action.payload);
      })
      .addCase(deleteDiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiary.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.diary = state.diary.map(item => item.id === updated.id ? updated : item);
      })
      .addCase(updateDiary.rejected, (state, action) => {
        state.loading = false;
        console.error('更新失败:', action.error);
        state.error = action.payload;
      });
  },
});

export default mydiarySlice.reducer;
