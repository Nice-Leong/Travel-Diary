import { configureStore } from '@reduxjs/toolkit';
import travelReducer from './modules/travel';
import detailReducer from './modules/detail';
import diaryReducer from './modules/diary';
import mydiaryReducer from './modules/mydiary';
const store = configureStore({
  reducer: {
    travel: travelReducer,
    detail: detailReducer,
    diary: diaryReducer,
    mydiary: mydiaryReducer,
  },
});

export default store;