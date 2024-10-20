export type RootState = {
    editor: EditorState;
    window: WindowState;
};

export interface EditorState {
    duration: number;
    currentTime: number;
    scene: Scene;
    sequences: Sequence[];
    selectedSequence: Sequence;
    selectedNodes: Node[];
    selectedTracks: Track[];
    selectedClipIds: string[];
}

export interface WindowState {
    topLeftResizerDelta: number;
    topRightResizerDelta: number;
    bottomResizerDelta: number;
    bottomLeftResizerDelta: number;
    previewWindowHeight: number;
    resizerActive: "topLeft" | "topRight" | "bottom" | "bottomLeft" | null;
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface Scene {
  nodes: Node[];
  sequences: Sequence[];
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

export interface Sequence {
  tracks: Track[];
}