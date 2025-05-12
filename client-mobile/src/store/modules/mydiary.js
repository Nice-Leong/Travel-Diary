import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockGetTravelNotes, mockDeleteTravelNote } from '@/mock/travelNotes';

export const fetchTravelNotes = createAsyncThunk(
  'diary/fetchTravelNotes',
  async () => {
    const res = await mockGetTravelNotes({ page: 1, pageSize: 100 });
    return res.data.list;
  }
);

export const deleteTravelNote = createAsyncThunk(
  'diary/deleteTravelNote',
  async (id, { dispatch }) => {
    await mockDeleteTravelNote(id);
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
      .addCase(fetchTravelNotes.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export default diarySlice.reducer;