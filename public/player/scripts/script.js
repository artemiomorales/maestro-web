import debounce from './debounce.js';
console.log('Script loaded');
const stage = document.querySelector('.stage');

window.addEventListener('message', handleMessage);

function handleMessage(event) {
    console.log('Message received:', event);
    const eventData = event.data;
    if(eventData.type === 'RESIZE') {
        debounce( handleResize(eventData.payload.previewWindowHeight) );
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

