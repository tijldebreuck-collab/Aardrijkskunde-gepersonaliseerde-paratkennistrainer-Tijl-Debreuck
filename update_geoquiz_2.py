import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

handle_result = """
  const handleResult = (isCorrect: boolean, chosenLabel: string) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setAnswerSuccess(isCorrect);
    setUserSelectedName(chosenLabel);
    
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
        generateNewQuestion(false);
    }, 1500);
  };
"""
content = re.sub(
    r'const handleResult = \(isCorrect: boolean, chosenLabel: string\) => \{.*?  \};',
    handle_result.strip(),
    content,
    flags=re.DOTALL
)

# Render Quiz Finished State
render_finished = """
      {/* Map Rendering Container */}
      {isMapQuizActive && isQuizFinished && (
        <div className="p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl text-center">
            <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Oefening Afgerond!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Je hebt alle onderdelen geraden.</p>
            <div className="flex justify-center gap-8 mb-8">
                <div>
                    <span className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Score</span>
                    <span className="text-4xl font-black text-emerald-500">{score} / {total}</span>
                </div>
                <div>
                    <span className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Percentage</span>
                    <span className="text-4xl font-black text-blue-500">{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
                </div>
            </div>
            <button onClick={() => { setIsMapQuizActive(false); resetScore(); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg text-lg">
                Terug naar Overzicht
            </button>
        </div>
      )}
      {isMapQuizActive && !isQuizFinished && (<div>
"""

content = re.sub(
    r'\{/\* Map Rendering Container \*/\}\n\s*\{isMapQuizActive && \(<div>',
    render_finished.strip(),
    content
)

# Also fix the previous generateNewQuestion where we called generateNewQuestion(true) on resetScore
# resetScore now calls generateNewQuestion(true)
content = re.sub(
    r'const resetScore = \(\) => \{\n\s*setScore\(0\);\n\s*setTotal\(0\);\n\s*setRemainingQuestions\(null\);\n\s*setIsQuizFinished\(false\);\n\s*generateNewQuestion\(\);\n\s*\};',
    'const resetScore = () => {\n    setScore(0);\n    setTotal(0);\n    setRemainingQuestions(null);\n    setIsQuizFinished(false);\n    generateNewQuestion(true);\n  };',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("done")
