import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Project = () => {
    const {
        resizerActive,
        bottomLeftResizerDelta
    } = useSelector( (state: any) => state.window);

    const projectRef = useRef<HTMLDivElement>(null);
    const [projectWidth, setProjectWidth] = useState<number>(0)

    useEffect(() => {
        if (projectRef.current) {
            setProjectWidth(projectRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    useEffect(() => {
        if (projectRef.current && resizerActive === "bottomLeft") {
            projectRef.current.style.flexBasis = `${projectWidth + bottomLeftResizerDelta}px`;
        }
    }, [resizerActive, projectWidth, bottomLeftResizerDelta]);

    return (
      <div className="project" ref={projectRef}>
        <h2>Project</h2>
      </div>
    );
  };
  
  export default Project;