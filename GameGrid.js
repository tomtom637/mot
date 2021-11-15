import { shuffleArray, generateRandomLetter } from './helper-functions.js';

export default class GameGrid {
  constructor({ size, words }) {
    this.size = size;
    this.words = shuffleArray(words);
    this.cells = [];
    this.start();
  }
  buildGrid() {
    for (let i = 0; i < this.size * this.size; ++i) {
      this.cells.push({
        row: ~~(i / this.size),
        column: (i % this.size),
        char: null
      });
    }
  }
  checkAvailable(type, row, column, word) {
    switch (type) {
      case 'horizontal':
        for (let i = 0; i < word.length; i++) {
          const cellText = this.cells
            .filter(c => c.row === row && c.column === column + i)[0]
            .char;
          if (cellText !== null && cellText !== word[i]) {
            return false;
          }
        }
        return true;
      case 'vertical':
        for (let i = 0; i < word.length; i++) {
          const cellText = this.cells
            .filter(c => c.row === row + i && c.column === column)[0]
            .char;
          if (cellText !== null && cellText !== word[i]) {
            return false;
          }
        }
        return true;
    }
  }
  placeWords() {
    let counter = 0;
    const { size, words, cells } = this;
    const horizontalWordsAmont = ~~(words.length / 2);
    for (let i = 0; i < words.length; ++i) {
      const maxDistanceFromEnd = size - words[i].length;
      if (i < horizontalWordsAmont) {
        let row = ~~(Math.random() * size);
        let columnStart = ~~(Math.random() * maxDistanceFromEnd);
        while (!this.checkAvailable('horizontal', row, columnStart, words[i])) {
          ++counter;
          if (counter > 200) {
            counter = 0;
            cells.map(c => c.char = null);
            this.placeWords();
          }
          row = ~~(Math.random() * size);
          columnStart = ~~(Math.random() * maxDistanceFromEnd);
        }
        for (let j = 0; j < words[i].length; ++j) {
          const currentCell = cells.filter(c => c.row === row && c.column === columnStart + j)[0];
          currentCell.char = words[i][j]
        }
      } else {
        let rowStart = ~~(Math.random() * maxDistanceFromEnd);
        let column = ~~(Math.random() * size);
        while (!this.checkAvailable('vertical', rowStart, column, words[i])) {
          ++counter;
          if (counter > 200) {
            counter = 0;
            cells.map(c => c.char = null);
            this.placeWords();
          }
          rowStart = ~~(Math.random() * maxDistanceFromEnd);
          column = ~~(Math.random() * size);
        }
        for (let j = 0; j < words[i].length; ++j) {
          const currentCell = cells.filter(c => c.row === rowStart + j && c.column === column)[0];
          currentCell.char = words[i][j]
        }
      }
    }
  }
  populateGrid() {
    this.cells
      .filter(c => c.char === null)
      .map(c => c.char = generateRandomLetter());
  }
  buildElements() {
    const appElement = document.getElementById('app');
    for (let cell of this.cells) {
      const cellElement = document.createElement('DIV');
      cellElement.classList = 'cell';
      cellElement.dataset.row = cell.row;
      cellElement.dataset.column = cell.column;
      const charElement = document.createElement('SPAN');
      charElement.classList = 'char';
      charElement.innerText = cell.char;
      cellElement.append(charElement);
      appElement.append(cellElement);
    }
  }
  start() {
    this.buildGrid();
    this.placeWords();
    this.populateGrid();
    this.buildElements();
  }
}