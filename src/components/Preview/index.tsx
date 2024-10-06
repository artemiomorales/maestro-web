import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviewWindowHeight } from '../../redux/slices/windowSlice';

const PreviewWindow = () => {
    const {
        resizerActive,
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta
    } = useSelector( (state: any) => state.window);
    
    const previewWindowRef = useRef<HTMLDivElement>(null);
    const [stageWidth, setStageWidth] = useState<number>(0)
    const dispatch = useDispatch();

    useEffect(() => {
        if (previewWindowRef.current) {
            setStageWidth(previewWindowRef.current.offsetWidth);
        }
    }, [ resizerActive ]);

    // useEffect(() => {
    //     document.addEventListener
    // ), []);

    useEffect(() => {
        if (previewWindowRef.current) {
            if (resizerActive === "topLeft") {
                previewWindowRef.current.style.flexBasis = `${stageWidth + (topLeftResizerDelta * -1 )}px`;
            }
            if (resizerActive === "topRight") {
                previewWindowRef.current.style.flexBasis = `${stageWidth + topRightResizerDelta}px`;
            }
        }
    }, [topLeftResizerDelta, topRightResizerDelta]);

    useEffect(() => {
        if (previewWindowRef.current) {
            dispatch(setPreviewWindowHeight(previewWindowRef.current.offsetHeight));
        }
    }, [bottomResizerDelta])

  return (
    <div className="preview-window" ref={previewWindowRef}>
       <PreviewIframe />
    </div>
  );
};

const PreviewIframe = () => {
    //   const { scene } = useSelector((state) => state.scene);
    //   const elements = useSelector((state) => state.timeline.elements);

    
    const {
        topLeftResizerDelta,
        topRightResizerDelta,
        bottomResizerDelta,
        previewWindowHeight,
        resizerActive,
    } = useSelector( (state: any) => state.window);

    const {
        scene
    } = useSelector( (state: any) => state.editor);

    console.log(scene);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if ( !iframe ) return;

        const resizeIframe = () => {
            const message = { type: 'RESIZE', payload: { previewWindowHeight: previewWindowHeight }  };
            iframe.contentWindow?.postMessage(message, '*');
        }
        resizeIframe();

        // Add load event listener
        iframe.addEventListener('load', resizeIframe);

        // Cleanup the event listener on component unmount
        return () => {
            iframe.removeEventListener('load', resizeIframe);
        };

    }, [topLeftResizerDelta, topRightResizerDelta, bottomResizerDelta, previewWindowHeight]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if ( !iframe ) return;

        if( resizerActive ) {
            iframe.style.pointerEvents = 'none';
        } else {
            iframe.style.pointerEvents = 'auto';
        }

    }, [resizerActive]);

    return (
        <div className="preview-iframe">
            <iframe
                src="/player/index.html"
                title="Player"
                ref={iframeRef}
            ></iframe>
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

export default PreviewWindow;