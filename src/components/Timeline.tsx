import { useDispatch, useSelector } from "react-redux";
import { Clip, setSelectedTracks, setSelectedClips, modifyClips } from "../redux/slices/editorSlice";
import { Track, setCurrentTime } from "../redux/slices/editorSlice";
import { useEffect, useRef, useState } from "react";

interface DraggingClipOffset {
  type: ClipAction;
  clipStart: number;
  clipEnd: number;
  x: number;
}

type ClipAction = 'translate' | 'resizeStart' | 'resizeEnd';

const Timeline = () => {
  const dispatch = useDispatch();
  const [ hashes, setHashes ] = useState<object[]>([]);
  const [ isScrubbing, setIsScrubbing ] = useState<boolean>(false);
  const [ draggingClipOffset, setDraggingClipOffset ] = useState<DraggingClipOffset | null>( null );
  const [ scrubberValue, setScrubberValue ] = useState<number>(0);
  const [ scale, setScale ] = useState<number>(3000);
  const [ interval, setInterval ] = useState<number>(30);
  const timelineRef = useRef<HTMLDivElement>(null);
  const clipWindowRef = useRef<HTMLTableCellElement>(null);

  const {
    scene,
    selectedSequence,
    currentTime,
    selectedTracks,
    selectedClips,
} = useSelector( (state: any) => state.editor);

const approximatelyEqual = (v1: number, v2: number, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon;

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
        console.log('dragging end');
        setIsScrubbing(false);
        setDraggingClipOffset(null);
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

  const callSetDraggingClipOffset = (clip: Clip, type: ClipAction, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = clipWindowRef?.current?.getBoundingClientRect();
    if(rect) {
      setDraggingClipOffset( {
        type: type,
        clipStart: clip.start,
        clipEnd: clip.end,
        x: e.clientX - rect.left,
      });
    }
  }

  return (
      <div className="timeline" ref={timelineRef} onMouseMove={(e) => {
        if ( draggingClipOffset ) {
          const rect = clipWindowRef?.current?.getBoundingClientRect();
          if ( rect ) {
            const deltaX = (e.clientX - rect.left) - draggingClipOffset.x;
            const offset = deltaX * 10 / scale;
            let newClip;
            if ( draggingClipOffset.type === 'translate' ) {
              newClip = {
                ...selectedClips[0],
                start: draggingClipOffset.clipStart + offset,
                end: draggingClipOffset.clipEnd + offset
              };
            } else if ( draggingClipOffset.type === 'resizeStart' ) {
              newClip = {
                ...selectedClips[0],
                start: draggingClipOffset.clipStart + offset,
              };
            } else if ( draggingClipOffset.type === 'resizeEnd' ) {
              newClip = {
                ...selectedClips[0],
                end: draggingClipOffset.clipEnd + offset,
              };
            }
            dispatch(modifyClips([newClip]));
          }
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
                  { track.clips.map((clip: Clip, index) => {
                    return (
                      <div key={index} className={ selectedClips[0]?.id === clip.id ? 'selected clip' : 'clip' } style={ getClipDimensions(clip) }
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        dispatch(setSelectedClips([clip]));
                        callSetDraggingClipOffset( clip, 'translate', e);
                      }}
                      >
                        <div className="clip-left-handle clip-handle"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedClips([clip]));
                            callSetDraggingClipOffset( clip, 'resizeStart', e);
                          }}
                        ></div>
                        <div className="clip-right-handle clip-handle"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedClips([clip]));
                            callSetDraggingClipOffset( clip, 'resizeEnd', e);
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