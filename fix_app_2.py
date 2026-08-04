with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const handleStartMultipleChoiceQuiz = (region: Region, category: QuestionType = 'capital') => {\n    setActiveRegion(region);\n    setActiveCategory(category);\n    setActiveCategoryMode(quizMode);", "  const handleStartMultipleChoiceQuiz = (region: Region, category: QuestionType = 'capital') => {\n    setActiveRegion(region);\n    setActiveCategory(category);\n    setActiveCategoryMode('multiple-choice');")

with open('src/App.tsx', 'w') as f:
    f.write(content)

