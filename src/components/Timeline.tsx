import { useDispatch, useSelector } from "react-redux";
import { setSelectedTracks, setSelectedClips, modifyClips, getSelectedClips } from "../redux/slices/editorSlice";
import { setCurrentTime } from "../redux/slices/editorSlice";
import { useContext, useEffect, useRef, useState } from "react";
import { Clip, RootState, Track } from "../redux/types";
import { EditorContext } from "../context/EditorContextProvider";

interface DraggingClipOffsets {
  type: ClipAction;
  initialClipStates: Clip[];
  x: number;
}

type ClipAction = 'translate' | 'resizeStart' | 'resizeEnd';

const Timeline = () => {
  const dispatch = useDispatch();
  const { previewIframeRef } = useContext(EditorContext);
  const [ hashes, setHashes ] = useState<object[]>([]);
  const [ isScrubbing, setIsScrubbing ] = useState<boolean>(false);
  const [ draggingClipsOffsets, setDraggingClipsOffsets ] = useState<DraggingClipOffsets | null>( null );
  const [ scrubberValue, setScrubberValue ] = useState<number>(0);
  const [ scale, setScale ] = useState<number>(3000);
  const [ interval, setInterval ] = useState<number>(30);
  const timelineRef = useRef<HTMLDivElement>(null);
  const clipWindowRef = useRef<HTMLTableCellElement>(null);
  const [timelineWidth, setTimelineWidth] = useState<number>(0)

  const {
    scene,
    selectedSequence,
    currentTime,
    selectedTracks,
  } = useSelector( (state: RootState) => {
    return state.editor;
  });

  const {
    resizerActive,
    bottomLeftResizerDelta
  } = useSelector( (state: any) => state.window);

  const selectedClips = useSelector(getSelectedClips);


  const approximatelyEqual = (v1: number, v2: number, epsilon = 0.001) =>
    Math.abs(v1 - v2) < epsilon;

  useEffect(() => {
      if (timelineRef.current) {
          setTimelineWidth(timelineRef.current.offsetWidth);
      }
  }, [ resizerActive ]);

  useEffect(() => {
      if (timelineRef.current && resizerActive === "bottomLeft") {
          timelineRef.current.style.flexBasis = `${timelineWidth + (bottomLeftResizerDelta * -1 )}px`;
      }
  }, [resizerActive, timelineWidth, bottomLeftResizerDelta]);

  useEffect(() => {
    if (clipWindowRef.current && timelineRef.current) {
      const newHashes = [];
      const timeline = timelineRef.current;
      setInterval(scale / 100);
      for (let i = interval; i < Math.max(window.innerWidth, scale) || approximatelyEqual(i, scale) ; i += interval) {
        newHashes.push({ left: i + 'px' });
      }
      setHashes(newHashes);

      const callSetScale = (e: any) => {
        if( !e.target.className.includes('track-label') && !e.target.className.includes('track-label-text') ) {
          e.preventDefault();
          setScale(scale + Math.round((e.deltaY + Number.EPSILON) * 100) / 100);
        }
      };

      const setDraggingFalse = () => {
        setIsScrubbing(false);
        setDraggingClipsOffsets(null);
      }

      timeline.addEventListener('wheel', callSetScale, { passive: false });
      window.addEventListener('mouseup', setDraggingFalse);
  
      return () => {
        timeline.removeEventListener('wheel', callSetScale);
        window.removeEventListener('mouseup', setDraggingFalse);
      }
    }
  }, [interval, scale]);

  useEffect(() => {
    const percentTime = currentTime / 10;
    setScrubberValue(percentTime);
  }, [ currentTime ]);

  const getClipDimensions = (clip: Clip) => {
    const leftPosition = scale * (clip.start / 10 );
    const rightPosition = scale * (clip.end / 10 );
    const width = rightPosition - leftPosition;

    return {
      left: `${leftPosition}px`,
      width: `${width}px`
    }
  }

  const getScrubberPosition = () => {
    let newPosition = (scale * scrubberValue) - 25;
    if( newPosition < -25 ) {
      newPosition = -25;
    } else if( newPosition > scale ) {
      newPosition = scale;
    }
    return `${newPosition}px`;
  }

  const callSetSelectedClips = (e: React.MouseEvent<HTMLDivElement>, clip: Clip, type: ClipAction) => {
    // only add clip if it's not already in the array
    const newSelectedClips = [...selectedClips, clip];
    if ( e.metaKey || selectedClips.length === 0) {
      dispatch(setSelectedClips(newSelectedClips));
    }
    const rect = clipWindowRef?.current?.getBoundingClientRect();
    if(rect) {
      setDraggingClipsOffsets( {
        type: type,
        initialClipStates: newSelectedClips,
        x: e.clientX - rect.left,
      } );
    }
  }

  return (
      <div className="timeline" ref={timelineRef} onMouseMove={(e) => {
        if ( draggingClipsOffsets ) {
          const rect = clipWindowRef?.current?.getBoundingClientRect();
          if ( ! rect ) { return; }
          const deltaX = (e.clientX - rect.left) - draggingClipsOffsets.x;
          const offset = deltaX * 10 / scale;
          const newClips: Clip[] = [];
          selectedClips.forEach((clip: Clip) => {
            const initialClipState = draggingClipsOffsets.initialClipStates.find((c: Clip) => c.id === clip.id);
            if( initialClipState ) {
              if ( draggingClipsOffsets.type === 'translate' ) {
                newClips.push({
                  ...clip,
                  start: initialClipState.start + offset,
                  end: initialClipState.end + offset
                });
              } else if ( draggingClipsOffsets.type === 'resizeStart' ) {
                newClips.push({
                  ...clip,
                  start: initialClipState.start + offset,
                });
              } else if ( draggingClipsOffsets.type === 'resizeEnd' ) {
                newClips.push({
                  ...clip,
                  end: initialClipState.end + offset,
                });
              }
            }
          });
          dispatch(modifyClips(newClips));
          previewIframeRef?.current?.contentWindow?.postMessage({ type: 'MODIFY_CLIPS', payload: { clips: newClips } }, '*');
        }
      }}>
        <div className="timeline-header">
          <div className="clip-window" ref={clipWindowRef} style={{ width: `${scale}px` }} onMouseDown={(e) =>{
                setIsScrubbing(true);
                const rect = clipWindowRef?.current?.getBoundingClientRect();
                if(rect) {
                  const x = e.clientX - rect.left;
                  const percent = x / rect.width;
                  setScrubberValue(percent);
                  dispatch(setCurrentTime(percent * 10));
                }
              }}
              onMouseMove={(e) => {
                if (isScrubbing) {
                  const rect = clipWindowRef?.current?.getBoundingClientRect();
                  if(rect) {
                    const x = e.clientX - rect.left;
                    const percent = x / rect.width;
                    setScrubberValue(percent);
                    dispatch(setCurrentTime(percent * 10));
                  }
                }
              }}>
            <div className="scrubber" style={{ left: `${ getScrubberPosition() }` }}>
              <div className="current-time">{currentTime}</div>
              <div className="handle"></div>
              <div className="bar"></div>
            </div>
            <input className="scrubber-input" type="range" min="0" max={10} step="0.1" value={currentTime} onChange={
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
        { scene && selectedSequence && selectedSequence.tracks.length > 0 && selectedSequence.tracks.map((track: Track) => {
            return (
              <div key={track.id} className="track">
                <div className={ selectedTracks[0]?.id === track.id ? 'selected track-label' : 'track-label' } onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setSelectedTracks([track]));
                }}>
                    <span className="track-label-text">{track.type}</span>
                </div>
                <div className="clip-container" style={{ width: `${scale}px` }}>
                  { track.clips.map((clip: Clip, index: number) => {
                    return (
                      <div key={index} className={ selectedClips.find((c: { id: string; }) => c.id === clip.id) ? 'selected clip' : 'clip' } style={ getClipDimensions(clip) }
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        callSetSelectedClips(e, clip, 'translate');
                      }}
                      >
                        <div className="clip-left-handle clip-handle"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            callSetSelectedClips(e, clip, 'resizeStart');
                          }}
                        ></div>
                        <div className="clip-right-handle clip-handle"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            callSetSelectedClips(e, clip, 'resizeEnd');
                          }}
                        ></div>
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