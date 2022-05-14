import states from './states.js';
import { myList, listElement, canvas, ctx, liveCtx } from './initialize-game.js';

// saves the coordinates of the firt cell touched
const initialtouchPoint = {x: null, y: null};

// add the event listeners
const app = document.getElementById('app');
app.addEventListener('mousedown', handleMousedown);
app.addEventListener('mousemove', handleMousemove);
app.addEventListener('mouseup', handleMouseup);
app.addEventListener('touchstart', handleMousedown);
app.addEventListener('touchmove', handleMousemove);
app.addEventListener('touchend', handleMouseup);

export function handleMousedown(e) {
  if(states.selecting) return;
  const bounding = canvas.getBoundingClientRect();
  let x;
  let y;
  if(e.touches !== undefined) {
    x = e.touches[0].clientX - bounding.left;
    y = e.touches[0].clientY - bounding.top;
  } else {
    x = e.clientX - bounding.left;
    y = e.clientY - bounding.top;
  }
  initialtouchPoint.x = x;
  initialtouchPoint.y = y;

  ctx.strokeStyle = 'rgba(0, 70, 200, 0.4)';
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(x, y); 

  liveCtx.strokeStyle = 'rgba(0, 70, 200, 0.4)';
  liveCtx.lineWidth = 15;
  liveCtx.beginPath();
  liveCtx.moveTo(x, y); 

  states.mousePressed = true;
  let cell = null;
  if (e.target.classList.contains('cell')) {
    cell = e.target;
  } else if(e.target.parentElement.classList.contains('cell')) {
    cell = e.target.parentElement;
  }
  if(cell !== null) {  
    states.answerCoordinates.push({
      row: cell.dataset.row,
      column: cell.dataset.column
    });  
  }
}

export function handleMousemove(e) {
  let cell = null;
  // if touch screen
  if(e.touches !== undefined) {
    e.preventDefault();
    const newTouchedElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    if (newTouchedElement.classList.contains('cell')) {
      cell = newTouchedElement;
    } else if (newTouchedElement.parentElement.classList.contains('cell')) {
      cell = newTouchedElement.parentElement;
    }
    // else if mouse
  } else {
    if(!states.mousePressed) return;
    if (e.target.classList.contains('cell')) {
      cell = e.target;
    } else if(e.target.parentElement.classList.contains('cell')) {
      cell = e.target.parentElement;
    }
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
    // if(!alreadyPickedCell) {   
      states.answerCoordinates.push({
        row: cell.dataset.row,
        column: cell.dataset.column
      });
    //}
  }
  const bounding = canvas.getBoundingClientRect();
  let x;
  let y;
  if(e.touches !== undefined) {
    x = e.touches[0].clientX - bounding.left;
    y = e.touches[0].clientY - bounding.top;
  } else {
    x = e.clientX - bounding.left;
    y = e.clientY - bounding.top;
  }
  liveCtx.clearRect(0, 0, canvas.width, canvas.height);
  liveCtx.beginPath();
  liveCtx.moveTo(initialtouchPoint.x, initialtouchPoint.y);
  liveCtx.lineTo(x, y);
  liveCtx.stroke();
}

export function handleMouseup(e) {
  const start = states.answerCoordinates[0];
  const end = states.answerCoordinates[states.answerCoordinates.length - 1];
  if(start.row === end.row && start.column === end.column) {
    states.selecting = true;
    document
      .querySelector(`[data-row="${parseInt(start.row)}"][data-column="${parseInt(start.column)}"]`)
      .style.background = 'rgba(255, 255, 255, 0.1)';
    return;
  } else {
    document
      .querySelector(`[data-row="${parseInt(start.row)}"][data-column="${parseInt(start.column)}"]`)
      .style.background = '#181818';
  }
  states.mousePressed = false;
  liveCtx.clearRect(0, 0, canvas.width, canvas.height);

  if(start.row === end.row) {
    for(let i = 0; i <= end.column - start.column; ++i) {
      states.cells.push(
        document.querySelector(`[data-row="${parseInt(start.row)}"][data-column="${parseInt(start.column) + i}"]`)
      );
      states.answer += states.cells[i].innerText.trim();
    }
  }
  if(start.column === end.column) {
    for(let i = 0; i <= end.row - start.row; ++i) {
      states.cells.push(
        document.querySelector(`[data-row="${parseInt(start.row) + i}"][data-column="${parseInt(start.column)}"]`)
      );
      states.answer += states.cells[i].innerText.trim();
    }
  }
  if(myList.indexOf(states.answer) !== -1) {
    states.cells.forEach(c => c.style.color = '#ff2893');
    listElement.querySelectorAll('li').forEach(li => {
      if(li.innerText === states.answer) {
        li.classList.add('li-found');
        const bounding = canvas.getBoundingClientRect();
        let x;
        let y;
        if(e.touches !== undefined) {
          x = e.changedTouches[0].clientX - bounding.left;
          y = e.changedTouches[0].clientY - bounding.top;
        } else {
          x = e.clientX - bounding.left;
          y = e.clientY - bounding.top;
        }
        ctx.beginPath();
        ctx.moveTo(initialtouchPoint.x, initialtouchPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
  }
  states.answerCoordinates = [];
  states.cells = [];
  states.answer = '';
  states.selecting = false;
}