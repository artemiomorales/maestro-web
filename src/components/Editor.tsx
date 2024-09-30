import React, { useEffect, useRef, useState } from 'react';
import Stage from './Stage';
import Timeline from './Timeline';
import Controls from './Controls';
import Hierarchy from './Hierarchy';
import Inspector from './Inspector';
import {
    setTopLeftResizerPosition,
    setTopRightResizerPosition,
    setBottomResizerPosition,
    setResizerActive
} from '../redux/slices/editorSlice';
import { useDispatch, useSelector } from 'react-redux';

const Editor = () => {
    const dispatch = useDispatch();
    const store = useSelector( (state: any) => state.editor);

    const widgetTopRef = useRef<HTMLDivElement>(null);
    const widgetBottomRef = useRef<HTMLDivElement>(null);
    
    const [startYDrag, setStartYDrag] = useState<number>(0);
    const [startXDrag, setStartXDrag] = useState<number>(0);

    let startWidgetTopHeight;
    let startWidgetBottomHeight;

    console.log(store);

    const handleMouseMove = (e: any) => {
        switch(store.resizerActive) {
            case "topLeft":
            dispatch(setTopLeftResizerPosition( (startXDrag - e.clientX) * -1));
            break;

            case "topRight":
            dispatch(setTopRightResizerPosition( (startXDrag - e.clientX) * -1));
            break;

            case "bottom":
            dispatch(setBottomResizerPosition( startYDrag - e.clientY));
            break;
        }
    }

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
            <div className="widget-top" ref={widgetTopRef}>
                <Hierarchy />
                <div className="resizer resizer-ew top-left-resizer"
                    onMouseDown={ (e) => {
                        dispatch(setResizerActive("topLeft"));
                        setStartXDrag(e.clientX);
                    }}
                ></div>
                <Stage />
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
            <div className="widget-bottom" ref={widgetBottomRef}>
                <Controls />
                <Timeline />
            </div>
        </div>
    );
};

export default Editor;