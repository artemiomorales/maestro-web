import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNode, Node } from "../redux/slices/editorSlice";

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
        selectedNode,
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

    console.log("Inspector render", selectedNode);
    const { elements } = scene;

    return (
        <div className="hierarchy" ref={hierarchyRef}>
            
            <table>
                <tbody>
                    {elements?.map((element: Node, index: number) => (
                        <tr key={index} className={ element?.id === selectedNode?.id ? 'selected' : '' } onClick={(e) => {
                            e.stopPropagation();
                            console.log("Clicked on element", element); 
                            dispatch(setSelectedNode(element));
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