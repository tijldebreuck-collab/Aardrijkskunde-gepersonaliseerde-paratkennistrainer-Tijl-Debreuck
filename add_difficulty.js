const fs = require('fs');

function categorizeDifficulty(name) {
  const easy = ['België', 'Nederland', 'Frankrijk', 'Duitsland', 'Groot-Brittannië', 'Spanje', 'Italië', 'Verenigde Staten', 'China', 'Japan'];
  const hard = ['Liechtenstein', 'Andorra', 'San Marino', 'Tuvalu', 'Nauru', 'Bhutan'];
  if (easy.includes(name)) return 'makkelijk';
  if (hard.includes(name)) return 'moeilijk';
  return 'gemiddeld';
}

['src/data/belgium.json', 'src/data/europe.json', 'src/data/world.json'].forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key] = data[key].map(item => {
        if (!item.difficulty) {
          item.difficulty = categorizeDifficulty(item.name || '');
        }
        return item;
      });
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      if (!data[key].difficulty) {
         data[key].difficulty = categorizeDifficulty(data[key].name || '');
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

console.log('Done json');
