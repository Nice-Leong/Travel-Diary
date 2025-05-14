import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import detailReducer from './modules/detail';
import diaryReducer from './modules/diary';
import mydiaryReducer from './modules/mydiary';
import profileReducer from './modules/profile';
const store = configureStore({
  reducer: {
    user: userReducer,
    detail: detailReducer,
    diary: diaryReducer,
    mydiary: mydiaryReducer,
    profile: profileReducer,
  },
});

export default store;