import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Hierarchy = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.window);

    const hierarchyRef = useRef<HTMLDivElement>(null);
    const [hierarchyWidth, setHierarchyWidth] = useState<number>(0)

    useEffect(() => {
        if (hierarchyRef.current) {
            setHierarchyWidth(hierarchyRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (hierarchyRef.current && resizerActive === "topLeft") {
            hierarchyRef.current.style.flexBasis = `${hierarchyWidth + topLeftResizerDelta}px`;
        }
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta]);

    return (
      <div className="hierarchy" ref={hierarchyRef}>
        
      </div>
    );
  };
  
  export default Hierarchy;