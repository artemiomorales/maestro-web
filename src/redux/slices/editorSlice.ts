import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vector2 {
    x: number;
    y: number;
}

export interface Scene {
  nodes: Node[];
  timelines: Timeline[];
} 

export interface Node {
    id: number;
    name: string;
    position: Vector2;
    scale: Vector2;
    type: "text" | "img" | "video" | "audio";
    path: string;
}

export interface Clip {
  id: string;
  start: number;
  end: number;
  opacityStart?: number;
  opacityEnd?: number;
}

export interface Track {
  id: string;
  type: string;
  path: string;
  clips: Clip[];
}

export interface Timeline {
  tracks: Track[];
}

export interface EditorState {
    duration: number;
    currentTime: number;
    scene: Scene;
    selectedNodes: Node[];
    selectedTracks: Track[];
    selectedClips: Clip[];
}

const initialState: EditorState = {
    duration: 0,
    currentTime: 0,
    scene: {
      nodes: [],
      timelines: []
    },
    selectedNodes: [],
    selectedTracks: [],
    selectedClips: []
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setScene: (state, action: PayloadAction<Scene>) => {
      state.scene = action.payload;
    },
    setSelectedNodes: (state, action: PayloadAction<Node[]>) => {
      state.selectedNodes = action.payload;
    },
    setSelectedTracks: (state, action: PayloadAction<Track[]>) => {
      state.selectedTracks = action.payload;
    },
    setSelectedClips: (state, action: PayloadAction<Clip[]>) => {
      state.selectedClips = action.payload;
    }
  },
});

export const { 
    setDuration,
    setCurrentTime,
    setScene,
    setSelectedNodes,
    setSelectedTracks,
    setSelectedClips
} = editorSlice.actions;

export default editorSlice.reducer;