import GameGrid from './GameGrid.js';
import { shuffleArray } from './helper-functions.js';

const myList = ['école', 'rentrée', 'manège', 'alice', 'cahier', 'poulet', 'oiseau', 'chemin'];

// initialize game
const gameGrid = new GameGrid({
  size: 10,
  words: myList
});

// build the list
const listElement = document.createElement('ul');
listElement.classList = 'list';
shuffleArray(gameGrid.words).forEach(word => {
  const item = document.createElement('li');
  item.innerText = word;
  listElement.append(item);
});

document.getElementById('wrapper').append(listElement);


// add the event listeners
const app = document.getElementById('app');

app.addEventListener('mousedown', handleMousedown);
app.addEventListener('mousemove', handleMousemove);
app.addEventListener('mouseup', handleMouseup);
app.addEventListener('touchstart', handleTouchstart);
app.addEventListener('touchmove', handleTouchmove);
app.addEventListener('touchend', handleTouchend);

const states = {
  mousePressed: false,
  answerGiven: '',
  answerCoordinates: [],
  cellElements: []
};

// CANVAS

const canvas = document.querySelector("#canvas");
const liveCanvas = document.querySelector('#live-canvas');
const ctx = canvas.getContext("2d");
const liveCtx = liveCanvas.getContext("2d");
canvas.width = parseInt(getComputedStyle(canvas).width);
canvas.height = parseInt(getComputedStyle(canvas).height);
liveCanvas.width = parseInt(getComputedStyle(liveCanvas).width);
liveCanvas.height = parseInt(getComputedStyle(canvas).height);
let initialtouchPoint = {x: null, y: null};

// mouse events
function handleMousedown(e) {

  // DEBUG

  const bounding = canvas.getBoundingClientRect();
  const x = e.clientX - bounding.left;
  const y = e.clientY - bounding.top;
  initialtouchPoint.x = x;
  initialtouchPoint.y = y;
  ctx.strokeStyle = 'rgba(0, 70, 200, 0.4)';
  ctx.lineWidth = 15;
  ctx.beginPath();       // Start a new path
  ctx.moveTo(x, y); 

  liveCtx.strokeStyle = 'rgba(0, 70, 200, 0.4)';
  liveCtx.lineWidth = 15;
  liveCtx.beginPath();       // Start a new path
  liveCtx.moveTo(x, y); 

  // DEBUG
  states.mousePressed = true;
  let cell = null;
  if (e.target.classList.contains('cell')) {
    cell = e.target;
  } else if(e.target.parentElement.classList.contains('cell')) {
    cell = e.target.parentElement;
  }
  if(cell !== null) {    
    states.answerGiven += cell.innerText;    
    states.answerCoordinates.push({
      row: cell.dataset.row,
      column: cell.dataset.column
    });
    states.cellElements.push(cell);
    cell.style.background = 'rgba(255, 255, 255, 0.2)';    
  }
}

function handleMousemove(e) {
  if(!states.mousePressed) return;
  let cell = null;
  if (e.target.classList.contains('cell')) {
    cell = e.target;
  } else if(e.target.parentElement.classList.contains('cell')) {
    cell = e.target.parentElement;
  }
  if(cell !== null) {
    let alreadyPickedCell = false;
    let receivedCoordinates = {
      row: cell.dataset.row,
      column: cell.dataset.column
    };
    for(let coord of states.answerCoordinates) {
      if(receivedCoordinates.row === coord.row && receivedCoordinates.column === coord.column) {
        alreadyPickedCell = true;
      }
    }
    if(!alreadyPickedCell) {
      states.answerGiven += cell.innerText;    
      states.answerCoordinates.push({
        row: cell.dataset.row,
        column: cell.dataset.column
      });
      states.cellElements.push(cell);
      cell.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  }
  // DEBUG
  const bounding = canvas.getBoundingClientRect();
  const x = e.clientX - bounding.left;
  const y = e.clientY - bounding.top;
  liveCtx.clearRect(0, 0, canvas.width, canvas.height);
  liveCtx.beginPath();
  liveCtx.moveTo(initialtouchPoint.x, initialtouchPoint.y);
  liveCtx.lineTo(x, y);  // Draw a line to (150, 100)
  liveCtx.stroke();

}

function handleMouseup(e) {
  states.mousePressed = false;
  // DEBUG
  liveCtx.clearRect(0, 0, canvas.width, canvas.height);
  // DEBUG
  states.cellElements.forEach(c => c.style.background = '#181818');
  if(myList.indexOf(states.answerGiven) !== -1) {
    states.cellElements.forEach(c => c.style.color = '#C90065');
    listElement.querySelectorAll('li').forEach(li => {
      if(li.innerText === states.answerGiven) {
        li.classList.add('li-found');
        // DEBUG
        const bounding = canvas.getBoundingClientRect();
        const x = e.clientX - bounding.left;
        const y = e.clientY - bounding.top;
        ctx.beginPath();
        ctx.moveTo(initialtouchPoint.x, initialtouchPoint.y);
        ctx.lineTo(x, y);  // Draw a line to (150, 100)
        ctx.stroke();
      }
    });
  }
  states.answerGiven = '';
  states.answerCoordinates = [];
  states.cellElements = [];  
}

// touch events
function handleTouchstart(e) {
  e.preventDefault();
  if (e.touches && e.touches.length < 2) {
    let cell = null;
    if (e.target.classList.contains('cell')) {
      cell = e.target;
    } else if (e.target.parentElement.classList.contains('cell')) {
      cell = e.target.parentElement;
    }
    if (cell !== null) {
      states.answerGiven += cell.innerText;
      states.answerCoordinates.push({
        row: cell.dataset.row,
        column: cell.dataset.column
      });
      states.cellElements.push(cell);
      cell.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  }
}

function handleTouchmove(e) {
  e.preventDefault();
  const newTouchedElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  let cell = null;
  if (newTouchedElement.classList.contains('cell')) {
    cell = newTouchedElement;
  } else if (newTouchedElement.parentElement.classList.contains('cell')) {
    cell = newTouchedElement.parentElement;
  }
  if (cell !== null && !states.cellElements.includes(cell)) {
    states.answerGiven += cell.innerText;
    states.answerCoordinates.push({
      row: cell.dataset.row,
      column: cell.dataset.column
    });
    states.cellElements.push(cell);
    cell.style.background = 'rgba(255, 255, 255, 0.2)';
  }
}

function handleTouchend(e) {
  //e.preventDefault();
  // sets backgrounds back to normal
  states.cellElements.forEach(c => c.style.background = '#181818');
  // checks that 
  if (myList.includes(states.answerGiven.replace(/\s/g,''))) {
    states.cellElements.forEach(c => c.style.color = '#C90065');
    listElement.querySelectorAll('li').forEach(li => {
      if (li.innerText === states.answerGiven.replace(/\s/g,'')) {
        li.classList.add('li-found');
      }
    });
  }
  states.answerGiven = '';
  states.answerCoordinates = [];
  states.cellElements = [];
}