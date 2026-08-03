import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Destructure showCorrectAnswer
    content = re.sub(
        r'interactiveMode = true( \}: [A-Za-z]+Props) \{',
        r'interactiveMode = true, showCorrectAnswer = false\1 {',
        content
    )
    content = re.sub(
        r'interactiveMode = true(\}: [A-Za-z]+Props) \{',
        r'interactiveMode = true, showCorrectAnswer = false \1 {',
        content
    )
    
    # Let's fix capitals in BelgiumMap
    if "BelgiumMap" in filename:
        content = re.sub(
            r'fill=\{\(showCorrectAnswer && cap\.id === activeQuestion\?\.targetId\) \? \'#10b981\' : color\}',
            r'fill={(showCorrectAnswer && `capital-${prov.id}` === activeQuestion?.targetId) ? \'#10b981\' : color}',
            content
        )

    with open(filename, 'w') as f:
        f.write(content)
print("Updated destruct")
