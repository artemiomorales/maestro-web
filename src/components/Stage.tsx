import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Stage = () => {
//   const { scene } = useSelector((state) => state.scene);
//   const elements = useSelector((state) => state.timeline.elements);

    const {
        resizerActive,
        topLeftResizerPosition,
        topRightResizerPosition,
        bottomResizerPosition
    } = useSelector( (state: any) => state.editor);
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const [stageWidth, setStageWidth] = useState<number>(0)

    useEffect(() => {
        if (stageContainerRef.current) {
            setStageWidth(stageContainerRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (stageContainerRef.current) {
            if (resizerActive === "topLeft") {
                stageContainerRef.current.style.flexBasis = `${stageWidth + (topLeftResizerPosition * -1 )}px`;
            }
            if (resizerActive === "topRight") {
                stageContainerRef.current.style.flexBasis = `${stageWidth + topRightResizerPosition}px`;
            }
        }
    }, [topLeftResizerPosition, topRightResizerPosition, bottomResizerPosition]);

  return (
    <div className="stage-container" ref={stageContainerRef}>
        <div className="stage">
        {/* {elements.map((element) => (
            <img
            key={element.id}
            src={element.path}
            style={{ opacity: element.opacity }}
            alt=""
            />
        ))} */}
        </div>
    </div>
  );
};

export default Stage;