import { useDispatch, useSelector } from "react-redux";
import { Clip, setSelectedTracks } from "../redux/slices/editorSlice";
import { Track, setCurrentTime } from "../redux/slices/editorSlice";
import { useCallback, useEffect, useRef, useState } from "react";

const Timeline = () => {
  const dispatch = useDispatch();
  const [ hashes, setHashes ] = useState<object[]>([]);
  const [ scale, setScale ] = useState<number>(3000);
  const clipWindowRef = useRef<HTMLTableCellElement>(null);

  const {
    scene,
    currentTime,
    selectedNodes,
    selectedTracks,
    selectedClips,
} = useSelector( (state: any) => state.editor);

  useEffect(() => {
    if (clipWindowRef.current) {
      const clipWindow = clipWindowRef.current;
      console.log(clipWindow.getBoundingClientRect());
      const hashCount = 10 / 0.25;
      const pixelOffset = scale / 10;
      const newHashes = [];
      for (let i = 0.25; i < 10; i += 0.25) {
        newHashes.push({ left: scale * (i / 10 ) + 75 });
      }
      setHashes(newHashes);

      const callSetScale = (e: any) => {
        console.log("e.deltaY", e.deltaY);
        setScale(scale + e.deltaY);
      };

      clipWindow.addEventListener('wheel', callSetScale);
  
      return () => {
        clipWindow.removeEventListener('wheel', callSetScale);
      }
    }
  }, [scale]);

  let tracks: Track[] = [];

  useEffect(() => {
    console.log('scene', scene);  
    if (scene) {
      tracks = scene.timelines[0]?.tracks;
    }
  }, [ scene.timelines ] );

  console.log("currentTime", currentTime);

  const getClipDimensions = (clip: Clip) => {
    const leftPosition = scale * (clip.start / 10 );
    const rightPosition = scale * (clip.end / 10 );
    const width = rightPosition - leftPosition;

    return {
      left: `${leftPosition}px`,
      width: `${width}px`
    }
  }

  return (
      <div className="timeline">
        <div className="timeline-header">
          <div className="clip-window" ref={clipWindowRef} style={{ width: `${scale}px` }}>
            <input className="scrubber" type="range" min="0" max={10} step="0.01" value={currentTime} onChange={
              (e) => {
                dispatch(setCurrentTime(parseFloat(e.target.value)));
              }
            }/>
            { hashes.map((hash: any, index: number) => {
              return (
                <div key={index} className="hash" style={ { left : hash.left }}>
                </div>
              )
            })}
          </div>
        </div>
        { scene && scene.timelines[0] && scene.timelines[0].tracks.length > 0 && scene.timelines[0].tracks.map((track: Track) => {
            return (
              <div key={track.id} className="track">
                <div className={ selectedTracks[0]?.id === track.id ? 'selected track-label' : 'track-label' } onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setSelectedTracks([track]));
                }}>
                    <span>{track.type}</span>
                </div>
                <div className="clip-container" style={{ width: `${scale}px` }}>
                  { track.clips.map((clip: Clip) => {
                    return (
                      <div key={clip.id} className={ selectedClips[0]?.id === clip.id ? 'selected clip' : 'clip' } style={ getClipDimensions(clip) } >
                      </div>
                    )
                  })}
                </div>
              </div>
            )
        })}
      </div>
    );
  };
  
  export default Timeline;