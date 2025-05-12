import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTravelNoteDetail } from '@/service/modules/detail';

export const fetchTravelNoteDetail = createAsyncThunk(
  'detail/fetchTravelNoteDetail',
  async (id) => {
    const res = await getTravelNoteDetail(id);
    return res.data;
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState: {
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelNoteDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelNoteDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchTravelNoteDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default detailSlice.reducer;
