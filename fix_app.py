import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const startMyLearningQuiz = (folderId?: string) => {",
    "const startMyLearningQuiz = (folderId?: string, quizMode: 'multiple-choice' | 'map' = 'multiple-choice') => {"
)

# Replace setActiveCategoryMode('multiple-choice'); with setActiveCategoryMode(quizMode);
content = content.replace("setActiveCategoryMode('multiple-choice');", "setActiveCategoryMode(quizMode);")

with open('src/App.tsx', 'w') as f:
    f.write(content)

