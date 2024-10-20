import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WindowState } from '../types';

const initialState: WindowState = {
    topLeftResizerDelta: 0,
    topRightResizerDelta: 0,
    bottomResizerDelta: 0,
    bottomLeftResizerDelta: 0,
    previewWindowHeight: 0,
    resizerActive: null,
};

const windowSlice = createSlice({
  name: 'window',
  initialState,
  reducers: {
    setResizerActive: (state, action: PayloadAction<"topLeft" | "topRight" | "bottom" | "bottomLeft" | null>) => {
        state.resizerActive = action.payload;
    },
    setTopLeftResizerDelta: (state, action: PayloadAction<number>) => {
        state.topLeftResizerDelta = action.payload;
    },
    setTopRightResizerDelta: (state, action: PayloadAction<number>) => {
        state.topRightResizerDelta = action.payload;
    },
    setBottomResizerDelta: (state, action: PayloadAction<number>) => {
        state.bottomResizerDelta = action.payload;
    },
    setBottomLeftResizerDelta: (state, action: PayloadAction<number>) => {
        state.bottomLeftResizerDelta = action.payload;
    },
    setPreviewWindowHeight: (state, action: PayloadAction<number>) => {
        state.previewWindowHeight = action.payload;
    },
  },
});

export const { 
    setResizerActive,
    setTopLeftResizerDelta,
    setTopRightResizerDelta,
    setBottomResizerDelta,
    setBottomLeftResizerDelta,
    setPreviewWindowHeight,
} = windowSlice.actions;

export default windowSlice.reducer;