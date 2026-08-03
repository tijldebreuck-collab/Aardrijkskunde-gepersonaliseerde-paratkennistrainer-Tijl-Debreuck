import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

generate_new_question = """
  const generateNewQuestion = (forceReset = false) => {
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

    let currentRemaining = remainingQuestions;
    if (forceReset || currentRemaining === null) {
        currentRemaining = [...pool];
        setRemainingQuestions(currentRemaining);
        setIsQuizFinished(false);
        setQuizScore({ correct: 0, total: currentRemaining.length });
        setScore(0);
        setTotal(0);
    }

    if (currentRemaining.length === 0) {
        setIsQuizFinished(true);
        setCurrentQuestion(null);
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
"""

# Find const generateNewQuestion = ... up to the next const handleResult =
content = re.sub(
    r'const generateNewQuestion = \(\) => \{.*?\}\s*;\s*(?=const handleResult =)',
    generate_new_question.strip() + '\n\n  ',
    content,
    flags=re.DOTALL
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated generateNewQuestion.")
