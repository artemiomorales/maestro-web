import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNodes } from "../redux/slices/editorSlice";
import { Node } from "../redux/types";

const Hierarchy = () => {
    const dispatch = useDispatch();
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.window);

    const {
        scene,
        selectedNodes,
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
            hierarchyRef.current.style.flexBasis = `${hierarchyWidth + topLeftResizerDelta}px`;
        }
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta, resizerActive, hierarchyWidth]);

    const { nodes } = scene;

    return (
        <div className="hierarchy" ref={hierarchyRef}>
            
            <table>
                <tbody>
                    {nodes?.map((element: Node, index: number) => (
                        <tr key={index} className={ element?.id === selectedNodes[0]?.id ? 'selected' : '' } onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedNodes([element]));
                        }}>
                            <td>
                                <span>{element.type}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        
        </div>
    );
  };
  
  export default Hierarchy;