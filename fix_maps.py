import re
import glob

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Ocean background
    content = re.sub(
        r'<rect width=\{width\} height=\{height\} fill="#0d1b2a[a-f0-9]{2}" />',
        '<rect width={width} height={height} fill="#e0f2fe" />',
        content
    )

    # Base country color
    content = re.sub(
        r"let fill = '#1e293b'; // off-slate",
        "let fill = '#f1f5f9'; // off-slate",
        content
    )
    content = re.sub(
        r"let stroke = '#334155'; // outline slate",
        "let stroke = '#94a3b8'; // outline slate",
        content
    )
    
    # In Belgium map, it might be different, let's just do regex
    content = re.sub(
        r"let fill = '#1e293b';",
        "let fill = '#f1f5f9';",
        content
    )
    content = re.sub(
        r"let stroke = '#334155';",
        "let stroke = '#94a3b8';",
        content
    )
    
    content = re.sub(
        r"let fill = '#2e1065';", # If belgium uses something else?
        "let fill = '#f1f5f9';",
        content
    )

    with open(filename, 'w') as f:
        f.write(content)

print("Updated map colors.")
