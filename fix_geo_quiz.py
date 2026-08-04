import re
with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

content = content.replace("belgiumHighways, GeoFeature", "belgiumHighways, belgiumMountains, GeoFeature")

content = content.replace(
    "if (c === 'highway') return belgiumHighways;",
    "if (c === 'highway') return belgiumHighways;\n      if (c === 'mountain') return belgiumMountains;"
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)

