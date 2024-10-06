import React, { useEffect, useRef, useState } from 'react';
import Preview from './Preview';
import Timeline from './Timeline';
import Controls from './Controls';
import Hierarchy from './Hierarchy';
import Inspector from './Inspector';
import {
    setTopLeftResizerDelta,
    setTopRightResizerDelta,
    setBottomResizerDelta,
    setResizerActive
} from '../redux/slices/windowSlice';
import { useDispatch, useSelector } from 'react-redux';

const Editor = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.window);

    const dispatch = useDispatch();
    const store = useSelector( (state: any) => state.window);

    const topWidgetRef = useRef<HTMLDivElement>(null);
    const bottomWidgetRef = useRef<HTMLDivElement>(null);
    
    const [startYDrag, setStartYDrag] = useState<number>(0);
    const [startXDrag, setStartXDrag] = useState<number>(0);

    const [topWidgetHeight, setTopWidgetHeight] = useState<number>(0)
    const [bottomWidgetHeight, setBottomWidgetHeight] = useState<number>(0)

    useEffect(() => {
        if (topWidgetRef.current) {
            setTopWidgetHeight(topWidgetRef.current.offsetHeight);
        }
        if (bottomWidgetRef.current) {
            setBottomWidgetHeight(bottomWidgetRef.current.offsetHeight);
        }
    }, [ resizerActive ]);

    const handleMouseMove = (e: any) => {
        switch(store.resizerActive) {
            case "topLeft":
            dispatch(setTopLeftResizerDelta( (startXDrag - e.clientX) * -1));
            break;

            case "topRight":
            dispatch(setTopRightResizerDelta( (startXDrag - e.clientX) * -1));
            break;

            case "bottom":
            dispatch(setBottomResizerDelta( startYDrag - e.clientY));
            break;
        }
    }

    useEffect(() => {
        if (topWidgetRef.current && bottomWidgetRef.current && resizerActive === "bottom") {
            bottomWidgetRef.current.style.flexBasis = `${bottomWidgetHeight + bottomResizerDelta}px`;
            bottomWidgetRef.current.style.height = `${bottomWidgetHeight + bottomResizerDelta}px`;
            topWidgetRef.current.style.flexBasis = `${topWidgetHeight - bottomResizerDelta}px`;
            topWidgetRef.current.style.height = `${topWidgetHeight - bottomResizerDelta}px`;
        }
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta, resizerActive, bottomWidgetHeight, topWidgetHeight]);

    const handleMouseUp = (e: any) => {
        dispatch(setResizerActive(null));
    }

    useEffect(()=> {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        } 
    });

    return (
        <div className="editor">
            <div className="widget-top" ref={topWidgetRef}>
                <Hierarchy />
                <div className="resizer resizer-ew top-left-resizer"
                    onMouseDown={ (e) => {
                        dispatch(setResizerActive("topLeft"));
                        setStartXDrag(e.clientX);
                    }}
                ></div>
                <Preview />
                <div className="resizer resizer-ew top-right-resizer"
                    onMouseDown={ (e) => {
                        dispatch(setResizerActive("topRight"));
                        setStartXDrag(e.clientX);
                    }}
                ></div>
                <Inspector />
            </div>
            <div className="resizer resizer-ns bottom-resizer"
                onMouseDown={ (e) => {
                    dispatch(setResizerActive("bottom"));
                    setStartYDrag(e.clientY);
                }}
            ></div>
            <div className="widget-bottom" ref={bottomWidgetRef}>
                <Controls />
                <Timeline />
            </div>
        </div>
    );
};

export default Editor;