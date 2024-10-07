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
      const pixelOffset = clipWindow.getBoundingClientRect().width / 10;
      const newHashes = [];
      for (let i = 1; i < 10; i++) {
        newHashes.push({ left: i * pixelOffset });
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

  return (
      <div className="timeline">
        <table>
          <tbody>
            <tr>
              <td>
                <strong>Timeline</strong>
              </td>
              <td className="clip-window" ref={clipWindowRef} style={{ width: `${scale}px` }}>
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
              </td>
            </tr>
            { scene && scene.timelines[0] && scene.timelines[0].tracks.length > 0 && scene.timelines[0].tracks.map((track: Track) => {
                return (
                  <tr key={track.id}>
                    <td className={ selectedTracks[0]?.id === track.id ? 'selected track' : 'track' } onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setSelectedTracks([track]));
                    }}>
                        <span>{track.type}</span>
                    </td>
                    <td className="clip-container" style={{ width: `${scale}px` }}>
                      { track.clips.map((clip: Clip) => {
                        return (
                          <div key={clip.id} className={ selectedClips[0]?.id === clip.id ? 'selected clip' : 'clip' } style={ { left : clip.start }} >
                          </div>
                        )
                      })}
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Timeline;