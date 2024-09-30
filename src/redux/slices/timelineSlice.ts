import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Clip {
  start: number;
  end: number;
  opacityStart?: number;
  opacityEnd?: number;
}

interface Element {
  id: string;
  type: string;
  path: string;
  clips: Clip[];
}

interface TimelineState {
  elements: Element[];
}

const initialState: TimelineState = {
  elements: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
    updateElement: (state, action: PayloadAction<Element>) => {
      const index = state.elements.findIndex(el => el.id === action.payload.id);
      if (index !== -1) {
        state.elements[index] = action.payload;
      }
    },
  },
});

export const { setElements, updateElement } = timelineSlice.actions;

export default timelineSlice.reducer;