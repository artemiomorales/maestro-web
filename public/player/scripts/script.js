import { debounce, deepClone } from './utils.js';
console.log('Script loaded');
const stage = document.querySelector('.stage');

let nodes = [];
let currentTime = 0;
let duration = 0;
let progress = 0;
let previousProgress = 0;
let animationFrameId;

let scrollDelta = 0;
let touchStartTime = 0;
let lastScrollY = window.scrollY;

window.addEventListener('message', handleMessage);

// override scroll event on stage
window.addEventListener('scroll', function (event) {
    touchStartTime = performance.now(); // Get the current time
    const currentScrollY = window.scrollY; // Get the current scroll position
    scrollDelta = currentScrollY - lastScrollY; // Change in scroll position
    modifySequence(scrollDelta / 100); // Process the frame
    lastScrollY = currentScrollY; // Update the last scroll position
});

function handleMessage(event) {
    const eventData = event.data;
    if(eventData.type === 'RESIZE') {
        debounce( handleResize(eventData.payload.previewWindowHeight) );
    }
    if(eventData.type === 'LOAD_SCENE') {
        debounce( handleLoadScene(eventData.payload.scene) );
    }   
    if(eventData.type === 'LOAD_SEQUENCE') {
        debounce( handleLoadSequence(eventData.payload.sequence) );
    }
    if(eventData.type === 'MODIFY_CLIPS') {
        debounce( modifyClips(eventData.payload.clips) );
    }
    if(eventData.type === 'SET_ELAPSED_TIME') {
        debounce( setSequenceTime(eventData.payload.currentTime) );
    }
}

function handleResize(parentWindowHeight) {
    const h = parentWindowHeight - 25;
    const w = h * 9 / 16;
    // set PreviewIframe width and height
    stage.style.width = w + 'px';
    stage.style.height = h + 'px';
    stage.style.top = (parentWindowHeight - h) / 2 + 'px';
}

let scene = null;
let selectedSequence = null;

function handleLoadScene(remoteSceneData) {
    scene = deepClone(remoteSceneData);
    if (scene.scene){
        duration = scene.scene.duration;
    }
    if (scene.nodes) {
        scene.nodes.forEach(dataElement => {
            const stageElement = document.createElement(dataElement.type);

            if (dataElement.type === 'img') {
                stageElement.src = dataElement.path;
            }

            if (dataElement.type === 'img' || dataElement.type === 'audio') {
                stageElement.src = dataElement.path;
                stageElement.autoplay = dataElement.autoplay;
                dataElement.isPlaying = dataElement.autoplay;
            }            
            stage.appendChild(stageElement);
            nodes.push({
                ...dataElement,
                stageElement,
            });
        });
    }
}

function handleLoadSequence(remoteSequenceData) {
    selectedSequence = deepClone(remoteSequenceData);
    if(selectedSequence.tracks) {
        selectedSequence.tracks.forEach(track => {
            track.clips.forEach(clip => {
                clip.duration = clip.end - clip.start;
            });
            const node = nodes.find( node => node.id === track.target );
            if(node) {
                if(!node.clips) {
                    node.clips = [];
                }
                node.clips.push(...track.clips);
            }
        });
    }

    console.log(scene);
}

function modifyClips(clips) {
    nodes.forEach(node => {
        node.clips.forEach(nodeClip => {
            const newClip = clips.find(clip => clip.id === nodeClip.id);
            if(newClip) {
                nodeClip.start = newClip.start;
                nodeClip.end = newClip.end;
            }
        });
    });
}

function modifySequence(delta) {
    let newTime = currentTime + delta;
    if(newTime < 0) {
        newTime = 0;
    } else if (newTime > duration) {
        newTime = duration;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Prevent overlapping animations
        }
    }
    progress = Math.max(0, Math.min(newTime / duration, 1));

    setSequenceTime(newTime);

    const message = { type: 'MODIFY_SEQUENCE', payload: { currentTime: newTime } };
    // Send the message to the parent window
    window.parent.postMessage(message, '*'); // Replace with the actual domain of the parent
}

function setSequenceTime(targetTime) {
    currentTime = targetTime;
    nodes.forEach(currentNode => {
        currentNode.clips.forEach((clip, index) => {
            processClip(currentNode, clip, targetTime, index);
        });
    });
}

function processClip(currentNode, clip, time, index) {
    // console.log('Processing clip:', clip);
    // console.log('Time:', time);
    if (time > clip.start && time < clip.end) {

        const clipProgress = (time - clip.start) / (clip.end - clip.start);

        // Process position
        if (clip.startY && clip.endY && clip.startX && clip.endX) {
            const topDelta = clip.endY - clip.startY;
            const leftDelta = clip.endX - clip.startX;
            currentNode.stageElement.style.transform =
                `translate(
                    ${clip.startX + (leftDelta * clipProgress)}px,
                    ${clip.startY + (topDelta * clipProgress)}px
                )`;
        }

        // Process opacity
        if (clip.opacityStart !== undefined && clip.opacityEnd !== undefined) {
            const opacityDelta = clip.opacityEnd - clip.opacityStart;
            currentNode.stageElement.style.opacity = clip.opacityStart + (opacityDelta * clipProgress);
        }

        if (clip.volumeStart !== undefined && clip.volumeEnd !== undefined) {
            if(currentNode.isPlaying === false) {
                console.log(currentNode);
                currentNode.stageElement.play();
                currentNode.isPlaying = true;
            }
            const volumeDelta = clip.volumeEnd - clip.volumeStart;
            currentNode.stageElement.volume = clip.volumeStart + (volumeDelta * clipProgress);
        }
    }
    else if (time <= clip.start && index === 0) {
        if (clip.opacityStart !== undefined && clip.opacityEnd !== undefined) {
            // Reset opacity
            currentNode.stageElement.style.opacity = clip.opacityStart;
        }
        if (clip.volumeStart !== undefined && clip.volumeEnd !== undefined) {
            currentNode.stageElement.volume = clip.volumeStart;
        }
    }
    else if (time >= clip.end && index === currentNode.clips.length - 1) {
        if (clip.opacityStart !== undefined && clip.opacityEnd !== undefined) {
            // Reset opacity
            currentNode.stageElement.style.opacity = clip.opacityEnd;
        }
        if (clip.volumeStart !== undefined && clip.volumeEnd !== undefined) {
            currentNode.stageElement.volume = clip.volumeEnd;
        }
    }
}