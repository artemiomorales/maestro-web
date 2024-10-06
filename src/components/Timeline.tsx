import { useDispatch, useSelector } from "react-redux";
import { Clip, setSelectedTracks } from "../redux/slices/editorSlice";
import { Track } from "../redux/slices/editorSlice";
import { useCallback, useEffect, useState } from "react";

const Timeline = () => {
  const dispatch = useDispatch();
  const [ hashes, setHashes ] = useState<object[]>([]);
  const clipWindowRef = useCallback( node => {
    if(node !== null) {
      console.log(node.getBoundingClientRect());
      const pixelOffset = node.getBoundingClientRect().width / 10;
      const newHashes = [];
      for (let i = 1; i < 10; i++) {
        newHashes.push({ left: i * pixelOffset });
      }
      setHashes(newHashes);
    }
  }, []);

  const {
    scene,
    selectedNodes,
    selectedTracks,
    selectedClips,
} = useSelector( (state: any) => state.editor);

  let tracks: Track[] = [];

  useEffect(() => {
    console.log('scene', scene);  
    if (scene) {
      tracks = scene.timelines[0]?.tracks;
    }
  }, [ scene.timelines ] );

  return (
      <div className="timeline">
        <table>
          <tbody>
            <tr>
              <td>
                <strong>Timeline</strong>
              </td>
              <td className="clip-window" ref={clipWindowRef}>
                <input className="scrubber" type="range" min="0" max="3000" step="1" />
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
                    <td className="clip-container">
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