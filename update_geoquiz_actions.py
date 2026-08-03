import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

handle_skip = """
  const handleSkipQuestion = () => {
    if (!currentQuestion || !remainingQuestions) return;
    const newRemaining = [...remainingQuestions, currentQuestion.geoItem];
    setRemainingQuestions(newRemaining);
    // Because we just modified the state, generating immediately might use old state if we rely on remainingQuestions
    // So we should just pick another one, but generateNewQuestion uses the state remainingQuestions.
    // Let's pass newRemaining directly to generateNewQuestion, but React setState is async.
    // Better to use a setState callback? 
  };
"""

# Let's fix generateNewQuestion to accept optional newRemaining pool
new_generate = """
  const generateNewQuestion = (forceReset = false, specificRemaining?: any[]) => {
    setHasAnswered(false);
    setAnswerSuccess(null);
    setUserSelectedName('');

    if (category === 'flag') {
      setCurrentQuestion(null);
      return;
    }

    let pool: any[] = [];
    if (region === 'world') {
      if (category === 'country') pool = worldJSON.countries || [];
      else if (category === 'capital') pool = worldCapitals;
      else if (category === 'river') pool = worldRivers;
      else if (category === 'mountain') pool = worldMountains;
    } else if (region === 'europe') {
      if (category === 'country') pool = europeJSON.countries || [];
      else if (category === 'capital') pool = europeCapitals;
      else if (category === 'river') pool = europeRivers;
      else if (category === 'mountain') pool = europeMountains;
    } else if (region === 'belgium') {
      if (category === 'capital') pool = belgiumJSON.provinces || [];
      else if (category === 'river') pool = belgiumRivers;
      else pool = belgiumJSON.provinces || [];
    }

    if (pool.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    let currentRemaining = specificRemaining || remainingQuestions;
    if (forceReset || !currentRemaining) {
        currentRemaining = [...pool];
        setIsQuizFinished(false);
        setQuizScore({ correct: 0, total: currentRemaining.length });
        setScore(0);
        setTotal(0);
    }

    if (currentRemaining.length === 0) {
        setIsQuizFinished(true);
        setCurrentQuestion(null);
        setRemainingQuestions([]);
        return;
    }

    // Pick a random target from remaining
    const randomIndex = Math.floor(Math.random() * currentRemaining.length);
    const target = currentRemaining[randomIndex];
    
    // Remove from remaining
    const newRemaining = [...currentRemaining];
    newRemaining.splice(randomIndex, 1);
    setRemainingQuestions(newRemaining);

    const qId = Math.random().toString();
    let targetId = target.id;
    let correctAnswer = target.name || target.naam || '';
    
    if (category === 'capital' && target.capital) {
      correctAnswer = target.capital;
      targetId = target.id.startsWith('capital-') ? target.id : `capital-${target.id}`;
    }

    setCurrentQuestion({
      id: qId,
      targetId,
      correctAnswer,
      category,
      geoItem: target
    });
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion || !remainingQuestions) return;
    const newRemaining = [...remainingQuestions, currentQuestion.geoItem];
    generateNewQuestion(false, newRemaining);
  };
"""

content = re.sub(
    r'const generateNewQuestion = \(.*?\{.*?\}\s*;\s*(?=const handleResult =)',
    new_generate.strip() + '\n\n  ',
    content,
    flags=re.DOTALL
)

handle_result = """
  const handleResult = (isCorrect: boolean, chosenLabel: string) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setAnswerSuccess(isCorrect);
    setUserSelectedName(chosenLabel);
    
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      setTimeout(() => {
          generateNewQuestion(false);
      }, 1500);
    } else {
      setTimeout(() => {
          generateNewQuestion(false);
      }, 3000);
    }
  };
"""

content = re.sub(
    r'const handleResult = \(isCorrect: boolean, chosenLabel: string\) => \{.*?\}\s*;\s*(?=const resetScore =)',
    handle_result.strip() + '\n\n  ',
    content,
    flags=re.DOTALL
)

# Update UI Button from Volgende vraag to Skip vraag
ui_skip = """
            <button
              disabled={hasAnswered}
              onClick={handleSkipQuestion}
              className={`py-2 px-5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                !hasAnswered 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed hidden'
              }`}
            >
              Skip vraag <ArrowRight className="w-4 h-4" />
            </button>
"""

content = re.sub(
    r'<button\s*disabled=\{!hasAnswered\}\s*onClick=\{generateNewQuestion\}\s*className=\{`py-2 px-5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1\.5 cursor-pointer \$\{\s*hasAnswered.*?\s*\}`\}\s*>\s*Volgende vraag <ArrowRight className="w-4 h-4" />\s*</button>',
    ui_skip.strip(),
    content,
    flags=re.DOTALL
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated Actions.")
