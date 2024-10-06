import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Vector2 {
    x: number;
    y: number;
}

interface Element {
    id: number;
    name: string;
    position: Vector2;
    scale: Vector2;
}

interface EditorState {
    duration: number;
    scene: object;
}

const initialState: EditorState = {
    duration: 0,
    scene: {},
};

const editorSlice = createSlice({
  name: 'window',
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setScene: (state, action: PayloadAction<object>) => {
        state.scene = action.payload;
    },
  },
});

export const { 
    setDuration,
    setScene
} = editorSlice.actions;

export default editorSlice.reducer;