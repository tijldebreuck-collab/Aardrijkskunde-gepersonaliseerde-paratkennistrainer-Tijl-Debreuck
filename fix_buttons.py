import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# Fix Region buttons
content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => handleRegionChange\(\'world\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: region === "world" ? "white" : "#85e1ef" }}',
    content
)

# Fix Europe
content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => handleRegionChange\(\'europe\'\)\}[^>]*?className=\{`[^`]*`\})\s*style=\{\{\s*color:\s*"#85e1ef"\s*\}\}',
    r'\1 style={{ color: region === "europe" ? "white" : "#85e1ef" }}',
    content
)

# Fix Belgium
content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => handleRegionChange\(\'belgium\'\)\}[^>]*?className=\{`[^`]*`\})\s*style=\{\{\s*color:\s*"#85e1ef"\s*\}\}',
    r'\1 style={{ color: region === "belgium" ? "white" : "#85e1ef" }}',
    content
)

# Fix Categories
categories = [
    ("province", ""),
    ("country", ""),
    ("capital", 'fontSize: "11px", '),
    ("river", ""),
    ("mountain", ""),
    ("flag", "")
]

for cat, extra in categories:
    # First remove existing style
    pattern = r'(<button\n\s*onClick=\{\(\) => setCategory\(\'' + cat + r'\'\)\}[^>]*?className=\{`[^`]*`\})(?:\s*style=\{\{[^\}]*\}\})?'
    replacement = r'\1 style={{ ' + extra + r'color: category === "' + cat + r'" ? "white" : "#85e1ef" }}'
    content = re.sub(pattern, replacement, content)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated button styles.")
