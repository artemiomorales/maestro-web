import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Hierarchy = () => {
    const {
        resizerActive,
        topLeftResizerPosition,
        topRightResizerPosition,
        bottomResizerPosition
    } = useSelector( (state: any) => state.editor);

    const hierarchyRef = useRef<HTMLDivElement>(null);
    const [hierarchyWidth, setHierarchyWidth] = useState<number>(0)

    useEffect(() => {
        if (hierarchyRef.current) {
            setHierarchyWidth(hierarchyRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (hierarchyRef.current && resizerActive === "topLeft") {
            hierarchyRef.current.style.flexBasis = `${hierarchyWidth + topLeftResizerPosition}px`;
        }
    }, [topLeftResizerPosition, topRightResizerPosition, bottomResizerPosition]);

    return (
      <div className="hierarchy" ref={hierarchyRef}>
        
      </div>
    );
  };
  
  export default Hierarchy;