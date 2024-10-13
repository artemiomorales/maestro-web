import { configureStore } from '@reduxjs/toolkit';
import windowReducer from './slices/windowSlice';
import editorReducer from './slices/editorSlice';
import timelineReducer from './slices/timelineSlice';

export const store = configureStore({
  reducer: {
    window: windowReducer,
    editor: editorReducer,
    timeline: timelineReducer,
  },
});