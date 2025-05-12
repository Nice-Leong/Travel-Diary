import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTravelNote } from '@/service/modules/publish';
import { mockGetTravelNotes } from '@/mock/travelNotes';

// 异步获取游记列表
export const fetchTravelNotes = createAsyncThunk(
  'diary/fetchTravelNotes',
  async () => {
    const res = await mockGetTravelNotes({ page: 1, pageSize: 100 });
    return res.data.list;
  }
);

// 异步发布游记
export const publishTravelNote = createAsyncThunk(
  'diary/publishTravelNote',
  async (note, { dispatch }) => {
    await addTravelNote(note);
    // 发布成功后刷新列表
    dispatch(fetchTravelNotes());
  }
);

const diarySlice = createSlice({
  name: 'diary',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTravelNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default diarySlice.reducer;