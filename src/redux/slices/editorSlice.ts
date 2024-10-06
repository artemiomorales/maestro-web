import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vector2 {
    x: number;
    y: number;
}

export interface Node {
    id: number;
    name: string;
    position: Vector2;
    scale: Vector2;
    type: "text" | "img" | "video" | "audio";
}

export interface EditorState {
    duration: number;
    scene: {
      elements: Node[];
    }
    selectedNode: Node | null;
}

const initialState: EditorState = {
    duration: 0,
    scene: {
      elements: []
    },
    selectedNode: null
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
    setSelectedNode: (state, action: PayloadAction<Node>) => {
        state.selectedNode = action.payload;
    }
  },
});

export const { 
    setDuration,
    setScene,
    setSelectedNode
} = editorSlice.actions;

export default editorSlice.reducer;