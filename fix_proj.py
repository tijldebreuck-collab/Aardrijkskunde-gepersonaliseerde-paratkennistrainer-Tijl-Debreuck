import re
with open('src/components/BelgiumMap.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'  const pathGenerator = d3\.geoPath\(\)\.projection\(projection\);\n  const pathGenerator = d3\.geoPath\(\)\.projection\(projection\);', '  const pathGenerator = d3.geoPath().projection(projection);', content)

with open('src/components/BelgiumMap.tsx', 'w') as f:
    f.write(content)

