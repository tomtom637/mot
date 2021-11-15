export const canvas = document.querySelector("#canvas");
export const liveCanvas = document.querySelector('#live-canvas');
export const ctx = canvas.getContext("2d");
export const liveCtx = liveCanvas.getContext("2d");
canvas.width = parseInt(getComputedStyle(canvas).width);
canvas.height = parseInt(getComputedStyle(canvas).height);
liveCanvas.width = parseInt(getComputedStyle(liveCanvas).width);
liveCanvas.height = parseInt(getComputedStyle(canvas).height);