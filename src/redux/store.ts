import { configureStore } from '@reduxjs/toolkit';
import windowReducer from './slices/windowSlice';
import timelineReducer from './slices/timelineSlice';

export const store = configureStore({
  reducer: {
    window: windowReducer,
    timeline: timelineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;