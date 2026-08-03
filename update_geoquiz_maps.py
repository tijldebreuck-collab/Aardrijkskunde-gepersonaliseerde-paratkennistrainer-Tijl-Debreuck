import re

with open('src/components/GeoQuiz.tsx', 'r') as f:
    content = f.read()

# Add showCorrectAnswer to Maps
content = re.sub(
    r'<WorldMap\s*activeQuestion=\{currentQuestion\}\s*onResult=\{handleResult\}\s*/>',
    r'<WorldMap \n            activeQuestion={currentQuestion} \n            onResult={handleResult}\n            showCorrectAnswer={hasAnswered && answerSuccess === false}\n          />',
    content
)

content = re.sub(
    r'<EuropeMap\s*activeQuestion=\{currentQuestion\}\s*onResult=\{handleResult\}\s*/>',
    r'<EuropeMap \n            activeQuestion={currentQuestion} \n            onResult={handleResult}\n            showCorrectAnswer={hasAnswered && answerSuccess === false}\n          />',
    content
)

content = re.sub(
    r'<BelgiumMap\s*activeQuestion=\{currentQuestion\}\s*onResult=\{handleResult\}\s*/>',
    r'<BelgiumMap \n            activeQuestion={currentQuestion} \n            onResult={handleResult}\n            showCorrectAnswer={hasAnswered && answerSuccess === false}\n          />',
    content
)

with open('src/components/GeoQuiz.tsx', 'w') as f:
    f.write(content)
print("Updated Map props")
