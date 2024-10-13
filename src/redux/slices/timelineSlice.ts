import { createSlice } from '@reduxjs/toolkit';

interface Clip {
  start: number;
  end: number;
  opacityStart?: number;
  opacityEnd?: number;
}

interface Track {
  id: string;
  type: string;
  path: string;
  clips: Clip[];
}

interface Timeline {
  tracks: Track[];
  selectedTracks: Track[];
  selectedClips: Clip[];
}

const initialState: Timeline = {
  tracks: [],
  selectedTracks: [],
  selectedClips: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    // setNodes: (state, action: PayloadAction<Element[]>) => {
    //   state.nodes = action.payload;
    // },
    // updateElement: (state, action: PayloadAction<Element>) => {
    //   const index = state.nodes.findIndex(el => el.id === action.payload.id);
    //   if (index !== -1) {
    //     state.nodes[index] = action.payload;
    //   }
    // },
  },
});

export const { } = timelineSlice.actions;

export default timelineSlice.reducer;