import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# CSS 3: Title Header Section background
content = content.replace(
    'className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/40 via-purple-900/20 to-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-md"',
    'className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/40 via-purple-900/20 to-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-md" style={{ backgroundColor: "#90E0EF" }}'
)

# CSS 1: Title Header paragraph
content = content.replace(
    'className="text-sm font-mono text-slate-600 dark:text-slate-400"\n          >\n            Draai aan het kompas en klik interactief op de juiste geografische coördinaten!\n          </p>',
    'className="text-sm font-mono text-slate-600 dark:text-slate-400"\n            style={{ color: "#2d2899", fontWeight: "bold", fontFamily: "Space Mono", width: "680px" }}\n          >\n            Draai aan het kompas en klik interactief op de juiste geografische coördinaten!\n          </p>'
)
# if the exact formatting was different:
content = re.sub(
    r'<p className="text-sm font-mono text-slate-600 dark:text-slate-400">\s*Draai aan het kompas en klik interactief op de juiste geografische coördinaten!\s*</p>',
    '<p className="text-sm font-mono text-slate-600 dark:text-slate-400" style={{ color: "#2d2899", fontWeight: "bold", fontFamily: "Space Mono", width: "680px" }}>\n            Draai aan het kompas en klik interactief op de juiste geografische coördinaten!\n          </p>',
    content
)

# Region Panel background (CSS 2) & Category Panel background (CSS 4)
# Let's target the exact comments
content = re.sub(
    r'\{/\* Region Panel \*/\}\n\s*<div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">',
    '{/* Region Panel */}\n        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3" style={{ backgroundColor: "#03045E" }}>',
    content
)

content = re.sub(
    r'\{/\* Quiz Category select panel \*/\}\n\s*<div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">',
    '{/* Quiz Category select panel */}\n        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3" style={{ backgroundColor: "#0077B6" }}>',
    content
)

# Region Panel h3 (CSS 6)
content = re.sub(
    r'<h3 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kies Regio / Kaart:</h3>',
    '<h3 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider" style={{ color: "#90E0EF" }}>Kies Regio / Kaart:</h3>',
    content
)

# Category Panel h3 (CSS 5)
content = re.sub(
    r'<h3 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Wat wil je raden\?</h3>',
    '<h3 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider" style={{ color: "#90E0EF" }}>Wat wil je raden?</h3>',
    content
)

# Button styling - using a simple replace for specific button texts
content = re.sub(
    r'(<button[^>]*>\s*🌐 Wereld\s*</button>)',
    r'\1', # no change
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => handleRegionChange\(\'europe\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: "#85e1ef" }}',
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => handleRegionChange\(\'belgium\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: "#85e1ef" }}',
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => setCategory\(\'capital\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ fontSize: "11px", color: "#85e1ef" }}',
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => setCategory\(\'river\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: "#85e1ef" }}',
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => setCategory\(\'mountain\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: "#85e1ef" }}',
    content
)

content = re.sub(
    r'(<button\n\s*onClick=\{\(\) => setCategory\(\'flag\'\)\}[^>]*?className=\{`[^`]*`\})',
    r'\1 style={{ color: "#85e1ef" }}',
    content
)


with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated GeoQuiz.tsx")
