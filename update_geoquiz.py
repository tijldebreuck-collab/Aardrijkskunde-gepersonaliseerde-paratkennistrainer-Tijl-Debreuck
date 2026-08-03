import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# Add states for remaining questions and quiz finished
state_add = """
  const [remainingQuestions, setRemainingQuestions] = useState<any[] | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
"""
content = re.sub(
    r'const \[isMapQuizActive, setIsMapQuizActive\] = useState\(false\);',
    'const [isMapQuizActive, setIsMapQuizActive] = useState(false);\n' + state_add,
    content
)

# Update reset score to also reset these
reset_score = """
  const resetScore = () => {
    setScore(0);
    setTotal(0);
    setRemainingQuestions(null);
    setIsQuizFinished(false);
    generateNewQuestion();
  };
"""
content = re.sub(
    r'const resetScore = \(\) => \{\s*setScore\(0\);\s*setTotal\(0\);\s*generateNewQuestion\(\);\s*\};',
    reset_score.strip(),
    content
)

# Rewrite generateNewQuestion
# We find generateNewQuestion = () => { ... }
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

content = re.sub(
    r'const generateNewQuestion = \(\) => \{.*?(?=const handleResult =)/s',
    generate_new_question.strip() + '\n\n  ',
    content,
    flags=re.DOTALL
)

# Now fix the useEffect for generateNewQuestion
content = re.sub(
    r'useEffect\(\(\) => \{\s*generateNewQuestion\(\);\s*\}, \[region, category\]\);',
    'useEffect(() => {\n    generateNewQuestion(true);\n  }, [region, category]);',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("done")
