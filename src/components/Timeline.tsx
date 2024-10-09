import { useDispatch, useSelector } from "react-redux";
import { Clip, setSelectedTracks } from "../redux/slices/editorSlice";
import { Track, setCurrentTime } from "../redux/slices/editorSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { current } from "@reduxjs/toolkit";

const Timeline = () => {
  const dispatch = useDispatch();
  const [ hashes, setHashes ] = useState<object[]>([]);
  const [ dragging, setDragging ] = useState<boolean>(false);
  const [ scrubberValue, setScrubberValue ] = useState<number>(0);
  const [ scale, setScale ] = useState<number>(3000);
  const [ interval, setInterval ] = useState<number>(30);
  const clipWindowRef = useRef<HTMLTableCellElement>(null);

  const {
    scene,
    currentTime,
    selectedNodes,
    selectedTracks,
    selectedClips,
} = useSelector( (state: any) => state.editor);

const approximatelyEqual = (v1: number, v2: number, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon;

  useEffect(() => {
    if (clipWindowRef.current) {
      const clipWindow = clipWindowRef.current;
      const newHashes = [];
      setInterval(scale / 100);
      for (let i = interval; i < scale || approximatelyEqual(i, scale) ; i += interval) {
        newHashes.push({ left: i + 'px' });
      }
      setHashes(newHashes);

      const callSetScale = (e: any) => {
        if( e.target.className.includes('clip-window') ||
            e.target.className.includes('clip-container') ||
            e.target.className.includes('clip') ||
            e.target.className.includes('track') ||
            e.target.className.includes('scrubber')) {
          e.preventDefault();
          setScale(scale + Math.round((e.deltaY + Number.EPSILON) * 100) / 100);
        }
      };

      const setDraggingFalse = () => {
        console.log('dragging end');
        setDragging(false);
      }

      window.addEventListener('wheel', callSetScale, { passive: false });
      window.addEventListener('mouseup', setDraggingFalse);
  
      return () => {
        window.removeEventListener('wheel', callSetScale);
        window.removeEventListener('mouseup', setDraggingFalse);
      }
    }
  }, [interval, scale]);

  let tracks: Track[] = [];

  useEffect(() => {
    if (scene) {
      tracks = scene.timelines[0]?.tracks;
    }
  }, [ scene.timelines ] );

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

  return (
      <div className="timeline">
        <div className="timeline-header">
          <div className="clip-window" ref={clipWindowRef} style={{ width: `${scale}px` }} onMouseDown={(e) =>{
                setDragging(true);
                const rect = clipWindowRef?.current?.getBoundingClientRect();
                if(rect) {
                  const x = e.clientX - rect.left;
                  const percent = x / rect.width;
                  setScrubberValue(percent);
                  dispatch(setCurrentTime(percent * 10));
                }
              }}
              onMouseMove={(e) => {
                if (dragging) {
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
                  { track.clips.map((clip: Clip, index) => {
                    return (
                      <div key={index} className={ selectedClips[0]?.id === clip.id ? 'selected clip' : 'clip' } style={ getClipDimensions(clip) } >
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