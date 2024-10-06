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

    useEffect(() => {
        if (previewWindowRef.current) {
            if (resizerActive === "topLeft") {
                previewWindowRef.current.style.flexBasis = `${stageWidth + (topLeftResizerDelta * -1 )}px`;
            }
            if (resizerActive === "topRight") {
                previewWindowRef.current.style.flexBasis = `${stageWidth + topRightResizerDelta}px`;
            }
        }
    }, [resizerActive, stageWidth, topLeftResizerDelta, topRightResizerDelta]);

    useEffect(() => {
        if (previewWindowRef.current) {
            dispatch(setPreviewWindowHeight(previewWindowRef.current.offsetHeight));
        }
    }, [bottomResizerDelta, dispatch])

  return (
    <div className="preview-window" ref={previewWindowRef}>
       <PreviewIframe />
    </div>
  );
};

const PreviewIframe = () => {    
    const {
        previewWindowHeight,
        resizerActive,
    } = useSelector( (state: any) => state.window);

    const {
        scene
    } = useSelector( (state: any) => state.editor);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if ( !iframe ) return;

        const resize = () => {
            const message = { type: 'RESIZE', payload: { previewWindowHeight: previewWindowHeight }  };
            iframe.contentWindow?.postMessage(message, '*');
        }
        const loadScene = () => {
            const message = { type: 'LOAD_SCENE', payload: { scene: scene }  };
            iframe.contentWindow?.postMessage(message, '*');
        }
        const preparePlayer = () => {
            resize();
            loadScene();
        }

        // Resize whenever the window height changes
        resize();

        // Add load event listener
        iframe.addEventListener('load', preparePlayer);

        // Cleanup the event listener on component unmount
        return () => {
            iframe.removeEventListener('load', preparePlayer);
        };

    }, [ previewWindowHeight, scene ]);

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
        </div>
    )
}

export default PreviewWindow;