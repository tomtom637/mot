import GameGrid from './GameGrid.js';
import { shuffleArray } from './helper-functions.js';

const myList = ['école', 'rentrée', 'manège', 'alice', 'élément', 'cahier', 'poulet', 'oiseau', 'nid', 'chemin'];

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

// mouse events
function handleMousedown(e) {
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
}

function handleMouseup(e) {
  states.mousePressed = false;
  states.cellElements.forEach(c => c.style.background = '#181818');
  if(myList.indexOf(states.answerGiven) !== -1) {
    states.cellElements.forEach(c => c.style.color = '#C90065');
    listElement.querySelectorAll('li').forEach(li => {
      if(li.innerText === states.answerGiven) {
        li.classList.add('li-found');
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
  if(e.touches && e.touches.length < 2) {
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
}

function handleTouchmove(e) {
  e.preventDefault();
  if(!states.mousePressed) return;
  const newTouchedElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  let cell = null;
  if (newTouchedElement.classList.contains('cell')) {
    cell = newTouchedElement;
  } else if(newTouchedElement.parentElement.classList.contains('cell')) {
    cell = newTouchedElement.parentElement;
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
}

function handleTouchend(e) {
  states.mousePressed = false;
  states.cellElements.forEach(c => c.style.background = '#181818');
  if(myList.indexOf(states.answerGiven) !== -1) {
    states.cellElements.forEach(c => c.style.color = '#C90065');
    listElement.querySelectorAll('li').forEach(li => {
      if(li.innerText === states.answerGiven) {
        li.classList.add('li-found');
      }
    });
  }
  states.answerGiven = '';
  states.answerCoordinates = [];
  states.cellElements = [];
}