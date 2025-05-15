import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import detailReducer from './modules/detail';
import diaryReducer from './modules/diary';
import mydiaryReducer from './modules/mydiary';
import profileReducer from './modules/profile';
import publishReducer from './modules/publish';
const store = configureStore({
  reducer: {
    user: userReducer,
    detail: detailReducer,
    diary: diaryReducer,
    mydiary: mydiaryReducer,
    profile: profileReducer,
    publish: publishReducer,
  },
});

export default store;