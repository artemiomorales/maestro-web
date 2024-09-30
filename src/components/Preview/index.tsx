import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviewWindowHeight } from '../../redux/slices/editorSlice';

const StageContainer = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.editor);
    
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const [stageWidth, setStageWidth] = useState<number>(0)
    const dispatch = useDispatch();

    useEffect(() => {
        if (stageContainerRef.current) {
            setStageWidth(stageContainerRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (stageContainerRef.current) {
            if (resizerActive === "topLeft") {
                stageContainerRef.current.style.flexBasis = `${stageWidth + (topLeftResizerDelta * -1 )}px`;
            }
            if (resizerActive === "topRight") {
                stageContainerRef.current.style.flexBasis = `${stageWidth + topRightResizerDelta}px`;
            }
        }
    }, [topLeftResizerDelta, topRightResizerDelta]);

    useEffect(() => {
        if (stageContainerRef.current) {
            dispatch(setPreviewWindowHeight(stageContainerRef.current.offsetHeight));
        }
    }, [bottomResizerDelta])

  return (
    <div className="stage-container" ref={stageContainerRef}>
       <Stage />
    </div>
  );
};

const Stage = () => {
    //   const { scene } = useSelector((state) => state.scene);
    //   const elements = useSelector((state) => state.timeline.elements);

    const {
        scene,
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta,
        previewWindowHeight,
    } = useSelector( (state: any) => state.editor);

    const stageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(stageRef.current) {
            const h = previewWindowHeight - 25;
            const w = h * 9 / 16;
            // set stage width and height
            stageRef.current.style.width = w + 'px';
            stageRef.current.style.height = h + 'px';
            stageRef.current.style.top = (previewWindowHeight - h) / 2 + 'px';
        }
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta, previewWindowHeight]);

    return (
        <div className="stage" ref={stageRef}>
        {/* {elements.map((element) => (
            <img
            key={element.id}
            src={element.path}
            style={{ opacity: element.opacity }}
            alt=""
            />
        ))} */}
        </div>
    )
}

export default StageContainer;