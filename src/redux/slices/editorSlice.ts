import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, EditorState, Scene, Sequence, Track, Clip, Node } from '../types';

const initialState: EditorState = {
    duration: 0,
    currentTime: 0,
    scene: {
      nodes: [],
      sequences: []
    },
    sequences: [],
    selectedSequence: {
      tracks: [],
    },
    selectedNodes: [],
    selectedTracks: [],
    selectedClipIds: []
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
    setSelectedSequence: (state, action: PayloadAction<Sequence>) => {
      state.selectedSequence = action.payload;
    },
    setSelectedNodes: (state, action: PayloadAction<Node[]>) => {
      state.selectedNodes = action.payload;
    },
    setSelectedTracks: (state, action: PayloadAction<Track[]>) => {
      state.selectedTracks = action.payload;
    },
    setSelectedClips: (state, action: PayloadAction<Clip[]>) => {
      const newSelectedClipIds: string[] = [...state.selectedClipIds];
      state.selectedSequence.tracks.forEach(track => {
        track.clips.forEach(clip => {
          const targetClip = action.payload.find(c => c.id === clip.id);
          if (targetClip) {
            if (!state.selectedClipIds.some(c => c === targetClip.id)) {
              newSelectedClipIds.push(targetClip.id);
            }
          }
        })
      });
      state.selectedClipIds = newSelectedClipIds;
    },
    modifyClips: (state, action: PayloadAction<Clip[]>) => {
      state.selectedSequence.tracks.forEach(track => {
        track.clips.forEach(clip => {
          const targetClip = action.payload.find(c => c.id === clip.id);
          if(targetClip) {
            clip.start = targetClip.start;
            clip.end = targetClip.end;
          }
        })
      })
    }
  },
});
export const getSelectedClips = createSelector(
  ( state: RootState ) => state.editor.selectedSequence,
  ( state: RootState ) => state.editor.selectedClipIds,
  ( selectedSequence, selectedClipIds) => {
    if(selectedSequence) {
      return selectedSequence.tracks.flatMap(track => track.clips.filter(clip => selectedClipIds.includes(clip.id)));
    }
    return [];
  }
);

export const { 
    setDuration,
    setCurrentTime,
    setScene,
    setSelectedSequence,
    setSelectedNodes,
    setSelectedTracks,
    setSelectedClips,
    modifyClips
} = editorSlice.actions;

export default editorSlice.reducer;