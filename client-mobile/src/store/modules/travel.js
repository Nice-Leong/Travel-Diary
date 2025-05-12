import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTravelNotes } from '@/service/modules/travel';

export const fetchTravelNotes = createAsyncThunk(
  'travel/fetchTravelNotes',
  async ({ page, pageSize, searchKey }) => {
    const response = await getTravelNotes({ page, pageSize, searchKey });
    return response.data;
  }
);

const travelSlice = createSlice({
  name: 'travel',
  initialState: {
    travelList: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
    pageSize: 10,
    searchKey: '',
    error: null,
    total: 0
  },
  reducers: {
    resetTravelList: (state) => {
      state.travelList = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
      state.total = 0;
    },
    setSearchKey: (state, action) => {
      state.searchKey = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelNotes.fulfilled, (state, action) => {
        state.loading = false;
        const { list, hasMore, total } = action.payload;
        
        if (state.currentPage === 1) {
          state.travelList = list;
        } else {
          state.travelList = [...state.travelList, ...list];
        }
        
        state.hasMore = hasMore;
        state.total = total;
        state.currentPage += 1;
      })
      .addCase(fetchTravelNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetTravelList, setSearchKey } = travelSlice.actions;
export default travelSlice.reducer;