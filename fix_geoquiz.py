import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# Replace the flag start block
start_marker = "{category === 'flag' && onStartFlagQuiz"
end_marker = "      {/* Active Question banner HUD & Next Trigger controls */}"

pattern = re.escape(start_marker) + r".*?" + re.escape(end_marker)

new_block = """{category === 'flag' && onStartFlagQuiz && (
        <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl gap-3 text-center py-10 mt-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Vlaggen Oefenen ({region === 'belgium' ? 'België' : region === 'europe' ? 'Europa' : 'Wereld'})</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Test je kennis van de vlaggen in deze regio.</p>
            <div className="flex justify-center gap-4 flex-wrap">
                <button onClick={() => onStartFlagQuiz(region, 'flag')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer text-lg">
                    Start Vlaggen Quiz
                </button>
            </div>
        </div>
      )}
        </>
      )}

      {/* Active Question banner HUD & Next Trigger controls */}"""

content = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Fixed GeoQuiz")
