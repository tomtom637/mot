import { shuffleArray, generateRandomLetter } from './helper-functions.js';

export default class GameGrid {
  constructor({ size, words }) {
    this.size = size;
    this.words = shuffleArray(words);
    this.start();
  }
  buildGrid() {
    const app = document.getElementById('app');
    for(let i = 0; i < this.size * this.size; ++i) {
      const cell = document.createElement('DIV');
      cell.classList = 'cell';
      cell.dataset.row = ~~(i / this.size);
      cell.dataset.column = (i % this.size);
      app.append(cell);
    }
  }
  checkAvailable(type, row, column, word) {
    switch(type) {
      case 'horizontal':
        for(let i = 0; i < word.length; i++) {
          const cellText = document.querySelector(`[data-row="${row}"][data-column="${column + i}"]`).innerText;
          if(cellText !== '' && cellText !== word[i]) {
            return false;
          }
        }
        return true;
      case 'vertical':
        for(let i = 0; i < word.length; i++) {
          const cellText = document.querySelector(`[data-row="${row + i}"][data-column="${column}"]`).innerText;
          if(cellText !== '' && cellText !== word[i]) {
            return false;
          }
        }
        return true;
    }
  }
  placeWords() {
    let counter = 0;
    const { size, words } = this;
    const horizontalWordsAmont = ~~(words.length / 2);
    for(let i = 0; i < words.length; ++i) {
      const maxDistanceFromEnd = size - words[i].length;
      if(i < horizontalWordsAmont) {
        let row = ~~(Math.random() * size);
        let columnStart = ~~(Math.random() * maxDistanceFromEnd);
        while(!this.checkAvailable('horizontal', row, columnStart, words[i])) {
          ++counter;
          if(counter > 200) {
            counter = 0;
            document.querySelectorAll('.cell').forEach(c => c.innerHTML = '');
            this.placeWords();
          }
          row = ~~(Math.random() * size);
          columnStart = ~~(Math.random() * maxDistanceFromEnd);
        }
        for(let j = 0; j < words[i].length; ++j) {
          const currentCell = document.querySelector(`[data-row="${row}"][data-column="${columnStart + j}"]`);
          if(currentCell.innerText !== words[i][j]) {
            const char = document.createElement('SPAN');
            char.classList = 'char';
            char.innerText = words[i][j];
            currentCell.append(char);
          }
        }
      } else {
        let rowStart = ~~(Math.random() * maxDistanceFromEnd);
        let column = ~~(Math.random() * size);
        while(!this.checkAvailable('vertical', rowStart, column, words[i])) {
          ++counter;
          if(counter > 200) {
            counter = 0;
            document.querySelectorAll('.cell').forEach(c => c.innerHTML = '');
            this.placeWords();
          }
          rowStart = ~~(Math.random() * maxDistanceFromEnd);
          column = ~~(Math.random() * size);
        }
        for(let j = 0; j < words[i].length; ++j) {
          const currentCell = document.querySelector(`[data-row="${rowStart + j}"][data-column="${column}"]`);
          if(currentCell.innerText !== words[i][j]) {
            const char = document.createElement('SPAN');
            char.classList = 'char';
            char.innerText = words[i][j];
            currentCell.append(char);
          }
        }
      }
    }
  }
  populateGrid() {
    document
      .querySelectorAll('.cell')
      .forEach(c => {
        if(c.innerText !== '') return;
        const char = document.createElement('SPAN');
        char.classList = 'char';
        char.innerText = generateRandomLetter();
        c.append(char);
      });
  }
  start() {
    this.buildGrid();
    this.placeWords();
    this.populateGrid();
  }
}