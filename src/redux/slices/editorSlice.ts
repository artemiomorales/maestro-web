import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    scene: object;
    topLeftResizerPosition: number;
    topRightResizerPosition: number;
    bottomResizerPosition: number;
    resizerActive: "topLeft" | "topRight" | "bottom" | null;
}

const initialState: EditorState = {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    scene: {},
    topLeftResizerPosition: 0,
    topRightResizerPosition: 0,
    bottomResizerPosition: 0,
    resizerActive: null,
};

const editorSlice = createSlice({
  name: 'editor',
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
    setTopLeftResizerPosition: (state, action: PayloadAction<number>) => {
        state.topLeftResizerPosition = action.payload;
    },
    setTopRightResizerPosition: (state, action: PayloadAction<number>) => {
        state.topRightResizerPosition = action.payload;
    },
    setBottomResizerPosition: (state, action: PayloadAction<number>) => {
        state.bottomResizerPosition = action.payload;
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
    setTopLeftResizerPosition,
    setTopRightResizerPosition,
    setBottomResizerPosition,
    setScene
} = editorSlice.actions;

export default editorSlice.reducer;