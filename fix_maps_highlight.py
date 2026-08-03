import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Add showCorrectAnswer to Props
    content = re.sub(
        r'(interactiveMode\?: boolean;.*?)\n\}',
        r'\1\n  showCorrectAnswer?: boolean;\n}',
        content
    )
    
    # Destructure showCorrectAnswer
    content = re.sub(
        r'interactiveMode = true( \}: .*?Props) {',
        r'interactiveMode = true, showCorrectAnswer = false\1 {',
        content
    )

    # In countries layer:
    content = re.sub(
        r'(const isClicked = clickedItem === mappedId;)',
        r'\1\n                const isTheCorrectOne = showCorrectAnswer && mappedId === activeQuestion?.targetId;',
        content
    )
    content = re.sub(
        r'(if \(isClicked\) \{\n\s*fill = isCorrectState \? \'#10b981\' : \'#f43f5e\';.*?\n\s*\})',
        r'\1\n\n                if (isTheCorrectOne) {\n                  fill = \'#10b981\';\n                }',
        content
    )

    # In mountains layer:
    content = re.sub(
        r'(<polygon\n.*?points=.*?)\n\s*fill=\{isClicked \? \(isCorrectState \? \'#059669\' : \'#e11d48\'\) : \(isHovered \? \'#b45309\' : \'#78350f\'\)\}',
        r'\1\n                      fill={isClicked ? (isCorrectState ? \'#059669\' : \'#e11d48\') : ((showCorrectAnswer && mount.id === activeQuestion?.targetId) ? \'#059669\' : (isHovered ? \'#b45309\' : \'#78350f\'))}',
        content
    )

    # In rivers layer:
    content = re.sub(
        r'(let strokeColor = isClicked \? \(isCorrectState \? \'#10b981\' : \'#f43f5e\'\) : \(isHovered \? \'#60a5fa\' : \'#38bdf8\'\);)',
        r'\1\n                if (showCorrectAnswer && river.id === activeQuestion?.targetId) strokeColor = \'#10b981\';',
        content
    )

    # In capitals layer:
    content = re.sub(
        r'(<circle\n.*?cy=.*?r=.*?)\n\s*fill=\{color\}',
        r'\1\n                      fill={(showCorrectAnswer && cap.id === activeQuestion?.targetId) ? \'#10b981\' : color}',
        content
    )
    
    with open(filename, 'w') as f:
        f.write(content)
print("Updated highlights")
