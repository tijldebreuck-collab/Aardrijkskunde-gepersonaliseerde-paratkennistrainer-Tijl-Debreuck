import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# CSS 4: container div
content = re.sub(
    r'(<div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl gap-3 text-center py-8 mt-6")',
    r'\1 style={{ backgroundColor: "#90E0EF" }}',
    content
)

# CSS 5: p
content = re.sub(
    r'(<p className="text-slate-600 dark:text-slate-400 mb-6 text-sm")(>Vind de juiste locaties op de interactieve kaart\.</p>)',
    r'\1 style={{ color: "#001fbf" }}\2',
    content
)

# CSS 6: button
content = re.sub(
    r'(<button onClick=\{\(\) => setIsMapQuizActive\(true\)\} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 text-lg")',
    r'\1 style={{ backgroundColor: "#002f99" }}',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated preview section styles.")
