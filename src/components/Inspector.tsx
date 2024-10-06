import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Inspector = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta,
    } = useSelector( (state: any) => state.window);

    const {
        selectedNode,
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
    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta, resizerActive, inspectorWidth]);

    return (
      <div className="inspector" ref={inspectorRef}>
        { selectedNode &&
            <div>
                <p>{selectedNode.type}</p>
                <table>
                    <tr>
                        <td>
                            <strong>Transform</strong>
                        </td>
                        <td>X</td>
                        <td>
                            <input type="number"></input>
                        </td>
                        <td>Y</td>
                        <td>
                            <input type="number"></input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Opacity</strong>
                        </td>
                        <td></td>
                        <td>
                            <input type="number"></input>
                        </td>
                    </tr>
                </table>
            </div>
        }
      </div>
    );

  };
  
  export default Inspector;