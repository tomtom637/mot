const fs = require('fs');

let rawdata = fs.readFileSync('../words.json');
const words = JSON.parse(rawdata);

let counter = 0;

for (let i = 0; i < words.length; i++) {
  if(words[i].word === `s’arrêter`) console.log(i);
}

