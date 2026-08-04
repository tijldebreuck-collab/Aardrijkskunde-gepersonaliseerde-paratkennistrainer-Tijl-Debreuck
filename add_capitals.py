import re

with open('src/data/geoData.ts', 'r') as f:
    content = f.read()

ankara = '  { id: "wd-s-ank", "name": "Ankara", category: "capital", coordinates: [32.8597, 39.9334] },\n'
bagdad = '  { id: "wd-s-bag", "name": "Bagdad", category: "capital", coordinates: [44.3615, 33.3152] },\n'

# Find the end of worldCapitals array
if 'id: "wd-l-aus-country"' in content:
    content = content.replace('  { id: "wd-l-aus-country"', ankara + bagdad + '  { id: "wd-l-aus-country"')

with open('src/data/geoData.ts', 'w') as f:
    f.write(content)

