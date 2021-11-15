import GameGrid from "./GameGrid.js";
import { shuffleArray } from './helper-functions.js';

export const myList = ['école', 'rentrée', 'manège', 'alice', 'cahier', 'poulet', 'oiseau', 'chemin'];

// initialize gameGrid
export const gameGrid = new GameGrid({
  size: 10,
  words: myList
});

// builds and appends the listElement
export const listElement = document.createElement('ul');
listElement.classList = 'list';
shuffleArray(gameGrid.words).forEach(word => {
  const item = document.createElement('li');
  item.innerText = word;
  listElement.append(item);
});
document.getElementById('container').append(listElement);

// initializes the 2 canvasses
export const canvas = document.querySelector("#canvas");
export const liveCanvas = document.querySelector('#live-canvas');
export const ctx = canvas.getContext("2d");
export const liveCtx = liveCanvas.getContext("2d");
canvas.width = parseInt(getComputedStyle(canvas).width);
canvas.height = parseInt(getComputedStyle(canvas).height);
liveCanvas.width = parseInt(getComputedStyle(liveCanvas).width);
liveCanvas.height = parseInt(getComputedStyle(canvas).height);