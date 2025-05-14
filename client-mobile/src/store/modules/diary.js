import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { diaryService } from '@/service/modules/diary';

const initialState = {
  diaryList: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  pageSize: 10
};

// 异步获取日记列表（分页）
export const fetchDiaryList = createAsyncThunk(
  'diary/fetchDiaryList',
  async ({ page, pageSize, searchKey }, thunkAPI) => {
    try {
      const data = await diaryService.getDiaryList(page, pageSize, searchKey);
      return { data, page };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || '请求失败');
    }
  }
);

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    resetDiaryList: (state) => {
      state.diaryList = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    setSearchKey: (state, action) => {
      state.searchKey = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDiaryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiaryList.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.diaryList = action.payload.data;
        } else {
          state.diaryList = [...state.diaryList, ...action.payload.data];
        }
        state.currentPage += 1;
        if (action.payload.data.length < state.pageSize) {
          state.hasMore = false;
        }
      })
      .addCase(fetchDiaryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetDiaryList, setSearchKey } = diarySlice.actions;
export default diarySlice.reducer;