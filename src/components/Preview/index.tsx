import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviewWindowHeight } from '../../redux/slices/windowSlice';
import { setCurrentTime } from '../../redux/slices/editorSlice';
import { EditorContext } from '../../context/EditorContextProvider';

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
    const dispatch = useDispatch();
    const {
        previewWindowHeight,
        resizerActive,
    } = useSelector( (state: any) => state.window);

    const {
        scene,
        currentTime,
        selectedSequence,
    } = useSelector( (state: any) => state.editor);

    const { previewIframeRef } = useContext(EditorContext);

    useEffect(() => {
        const iframe = previewIframeRef?.current;
        if ( !iframe ) return;

        const resize = () => {
            const message = { type: 'RESIZE', payload: { previewWindowHeight: previewWindowHeight }  };
            iframe.contentWindow?.postMessage(message, '*');
        }
        const loadScene = () => {
            iframe.contentWindow?.postMessage({ type: 'LOAD_SCENE', payload: { scene }  }, '*');
            iframe.contentWindow?.postMessage({ type: 'LOAD_SEQUENCE', payload: { sequence: selectedSequence }  }, '*');
        }
        const preparePlayer = () => {
            resize();
            loadScene();
        }

        const handleModifySequence = (e: any) => {
            const data = e.data;

            // Do something with the message
            if (data.type === 'MODIFY_SEQUENCE' && data.payload.currentTime ) {
                console.log('MODIFY_SEQUENCE', data.payload.currentTime);
                dispatch( setCurrentTime(data.payload.currentTime) );
            }
        }

        // Resize whenever the window height changes
        resize();

        // Add load event listener
        iframe.addEventListener('load', preparePlayer);
        window.addEventListener('message', handleModifySequence);

        // Cleanup the event listener on component unmount
        return () => {
            iframe.removeEventListener('load', preparePlayer);
            window.removeEventListener('message', handleModifySequence);
        };

    }, [dispatch, previewWindowHeight, scene]);

    useEffect(() => {
        const iframe = previewIframeRef?.current;
        if ( !iframe ) return;

        const message = { type: 'SET_ELAPSED_TIME', payload: { currentTime }  };
        iframe.contentWindow?.postMessage(message, '*');

    }, [ currentTime ]);

    useEffect(() => {
        const iframe = previewIframeRef?.current;
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
                ref={previewIframeRef}
            ></iframe>
        </div>
    )
}

export default PreviewWindow;