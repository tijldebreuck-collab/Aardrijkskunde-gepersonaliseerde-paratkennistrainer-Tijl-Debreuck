const fs = require('fs');

function categorizeDifficulty(name) {
  const easy = ['België', 'Nederland', 'Frankrijk', 'Duitsland', 'Groot-Brittannië', 'Spanje', 'Italië', 'Verenigde Staten', 'China', 'Japan', 'Londen', 'Parijs', 'Berlijn', 'Madrid', 'Rome', 'Antwerpen', 'Gent', 'Brussel'];
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
    } else if (typeof data[key] === 'object' && data[key] !== null && data[key].name) {
      if (!data[key].difficulty) {
         data[key].difficulty = categorizeDifficulty(data[key].name || '');
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

// Update geoData.ts
let tsData = fs.readFileSync('src/data/geoData.ts', 'utf8');
tsData = tsData.replace(/(id:.*?,.*?name:.*?)(?:,\s*difficulty:\s*['"][^'"]+['"])?(\s*\}|\s*,)/g, (match, p1, p2) => {
  // Rough replacement for ts files, but might be easier to just let TS handle it via mapping or write a script
  return match; 
});
fs.writeFileSync('src/data/geoData.ts', tsData);

console.log('Done json');
