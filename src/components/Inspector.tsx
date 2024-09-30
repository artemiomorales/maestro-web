import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Inspector = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.editor);

    const inspectorRef = useRef<HTMLDivElement>(null);
    const [inspectorWidth, setInspectorWidth] = useState<number>(0)

    useEffect(() => {
        if (inspectorRef.current) {
            setInspectorWidth(inspectorRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (inspectorRef.current && resizerActive === "topRight") {
            inspectorRef.current.style.flexBasis = `${inspectorWidth - topRightResizerDelta}px`;
        }
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta]);

    return (
      <div className="inspector" ref={inspectorRef}>
        
      </div>
    );

  };
  
  export default Inspector;