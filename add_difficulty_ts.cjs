const fs = require('fs');

let tsData = fs.readFileSync('src/data/geoData.ts', 'utf8');

function categorizeDifficulty(name) {
  const easy = ['België', 'Nederland', 'Frankrijk', 'Duitsland', 'Groot-Brittannië', 'Spanje', 'Italië', 'Verenigde Staten', 'China', 'Japan', 'Londen', 'Parijs', 'Berlijn', 'Madrid', 'Rome', 'Antwerpen', 'Gent', 'Brussel'];
  const hard = ['Liechtenstein', 'Andorra', 'San Marino', 'Tuvalu', 'Nauru', 'Bhutan'];
  if (easy.includes(name)) return 'makkelijk';
  if (hard.includes(name)) return 'moeilijk';
  return 'gemiddeld';
}

tsData = tsData.replace(/(name:\s*['"]([^'"]+)['"])(.*?)(?=\s*\})/g, (match, namePart, name, restPart) => {
    if (!restPart.includes('difficulty:')) {
        return `${namePart}${restPart}, difficulty: "${categorizeDifficulty(name)}"`;
    }
    return match;
});

// Update the interface
tsData = tsData.replace(/alternatives\?: string\[\];/, "alternatives?: string[];\n  difficulty?: 'makkelijk' | 'gemiddeld' | 'moeilijk' | string;");

fs.writeFileSync('src/data/geoData.ts', tsData);
console.log('Done TS');
