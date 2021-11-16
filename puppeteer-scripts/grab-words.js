const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.encyclopedie-incomplete.com/?Les-600-Mots-Francais-Les-Plus');

  const result = await page.evaluate(() => {

    const words = [];

    document.querySelectorAll('td strong').forEach(t => {
      words.push(t.firstChild.data);
    });
    return words;
  });
  
  let data = JSON.stringify(result, null, 2);
  fs.writeFileSync('words.json', data);

  await browser.close();
})();