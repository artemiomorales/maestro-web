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
    console.log('Scrolling:', currentScrollY);
    scrollDelta = currentScrollY - lastScrollY; // Change in scroll position
    console.log('Scroll delta:', scrollDelta);
    modifySequence(scrollDelta / 100); // Process the frame
    lastScrollY = currentScrollY; // Update the last scroll position
});

function handleMessage(event) {
    console.log('Message received:', event);
    const eventData = event.data;
    if(eventData.type === 'RESIZE') {
        debounce( handleResize(eventData.payload.previewWindowHeight) );
    }
    if(eventData.type === 'LOAD_SCENE') {
        debounce( handleLoadScene(eventData.payload.scene) );
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

function handleLoadScene(remoteSceneData) {
    scene = deepClone(remoteSceneData);
    if (scene.scene){
        duration = scene.scene.duration;
    }
    if (scene.nodes) {
        scene.nodes.forEach(dataElement => {
            const stageElement = document.createElement(dataElement.type);

            dataElement.clips.forEach(clip => {
                clip.duration = clip.end - clip.start;
            });

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

function modifySequence(delta) {
    currentTime += delta;
    if(currentTime < 0) {
        currentTime = 0;
    } else if (currentTime > duration) {
        currentTime = duration;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Prevent overlapping animations
        }
    }
    progress = Math.max(0, Math.min(currentTime / duration, 1));

    nodes.forEach(currentNode => {
        currentNode.clips.forEach((clip, index) => {
            processClip(currentNode, clip, currentTime, index);
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