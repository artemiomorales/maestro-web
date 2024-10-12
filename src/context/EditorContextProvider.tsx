import { createContext, useRef } from "react";

export interface EditorContextType {
    previewIframeRef: React.RefObject<HTMLIFrameElement> | null;
}

export const EditorContext = createContext<EditorContextType>({ previewIframeRef: null });

export const EditorContextProvider = ({ children }: { children: React.ReactNode }) => {
    const previewIframeRef = useRef<HTMLIFrameElement>(null);
    return <EditorContext.Provider value={{ previewIframeRef }}>
        {children}
    </EditorContext.Provider>
}