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
        selectedNodes,
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
        { selectedNodes[0] &&
            <div>
                <p>{selectedNodes[0].type}</p>
                <table>
                    <tbody>
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
                    </tbody>
                </table>
                { selectedNodes[0].type === "img" && selectedNodes[0].path !== "" &&
                    <img src={selectedNodes[0].path}></img>
                }
            </div>
        }
      </div>
    );

  };
  
  export default Inspector;