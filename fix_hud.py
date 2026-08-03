import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# Make the HUD only show when not finished
content = re.sub(
    r'\{currentQuestion && isMapQuizActive && \(',
    '{currentQuestion && isMapQuizActive && !isQuizFinished && (',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("done")
