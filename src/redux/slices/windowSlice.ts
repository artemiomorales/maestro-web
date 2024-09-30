import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    scene: object;
    topLeftResizerDelta: number;
    topRightResizerDelta: number;
    bottomResizerDelta: number;
    previewWindowHeight: number;
    resizerActive: "topLeft" | "topRight" | "bottom" | null;
}

const initialState: EditorState = {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    scene: {},
    topLeftResizerDelta: 0,
    topRightResizerDelta: 0,
    bottomResizerDelta: 0,
    previewWindowHeight: 0,
    resizerActive: null,
};

const windowSlice = createSlice({
  name: 'window',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setResizerActive: (state, action: PayloadAction<"topLeft" | "topRight" | "bottom" | null>) => {
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
    setPreviewWindowHeight: (state, action: PayloadAction<number>) => {
        state.previewWindowHeight = action.payload;
    },
    setScene: (state, action: PayloadAction<object>) => {
        state.scene = action.payload;
    },
  },
});

export const { 
    setCurrentTime,
    setDuration,
    play,
    pause,
    setResizerActive,
    setTopLeftResizerDelta,
    setTopRightResizerDelta,
    setBottomResizerDelta,
    setPreviewWindowHeight,
    setScene
} = windowSlice.actions;

export default windowSlice.reducer;