import re

# 1. Update GeoQuiz.tsx (Active Question banner HUD)
with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'(<div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl gap-3")',
    r'\1 style={{ backgroundColor: "#243664" }}',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)

# 2. Update WorldMap, EuropeMap, BelgiumMap (Layer Toggle Buttons)
files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]
for filename in files:
    with open(filename, 'r') as f:
        content = f.read()
    
    # We find the 4 buttons inside the div with className "flex flex-wrap gap-2 mb-3"
    # Wait, they don't have style tags yet. We can just add them.
    # Button 1 (showCountries)
    content = re.sub(
        r'(<button\n\s*onClick=\{.*?setShowCountries.*?\n\s*className=\{.*?\}\n\s*>)',
        r'\1 style={{ color: "#779cdc" }}',
        content
    )
    # Button 2 (showCapitals)
    content = re.sub(
        r'(<button\n\s*onClick=\{.*?setShowCapitals.*?\n\s*className=\{.*?\}\n\s*>)',
        r'\1 style={{ color: "#e0ba27" }}',
        content
    )
    # Button 3 (showRivers)
    content = re.sub(
        r'(<button\n\s*onClick=\{.*?setShowRivers.*?\n\s*className=\{.*?\}\n\s*>)',
        r'\1 style={{ color: "#57a8cb" }}',
        content
    )
    # Button 4 (showMountains)
    content = re.sub(
        r'(<button\n\s*onClick=\{.*?setShowMountains.*?\n\s*className=\{.*?\}\n\s*>)',
        r'\1 style={{ color: "#53d3a4" }}',
        content
    )

    with open(filename, 'w') as f:
        f.write(content)

print("Applied styles")
