import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix handleStartFlagQuiz
old_handler = """  const handleStartFlagQuiz = (region: Region, mode: QuizMode) => {
    setActiveRegion(region);
    setActiveCategory('flag');
    setActiveCategoryMode(mode);
    if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    resetSession();
    generateQuestion();
    setTotalTimeSpent(0);
    setQuizCompleted(false);
    setIsPlaying(true);
    questionStartTimeRef.current = Date.now();
  };"""

new_handler = """  const handleStartFlagQuiz = (region: Region, mode: QuizMode) => {
    setActiveRegion(region);
    setActiveCategory(region === 'belgium' ? 'province' : 'country');
    setActiveCategoryMode('flag'); // Ignore the passed mode, always use 'flag'
    if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    resetSession();
    generateQuestion();
    setTotalTimeSpent(0);
    setQuizCompleted(false);
    setIsPlaying(true);
    questionStartTimeRef.current = Date.now();
  };"""

content = content.replace(old_handler, new_handler)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Fixed App.tsx")
