import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

import_statement = "import { MapQuizPlayer } from './components/exercises/MapQuizPlayer';\n"
if "MapQuizPlayer" not in content:
    content = content.replace("import { MultipleChoice } from './components/exercises/MultipleChoice';", import_statement + "import { MultipleChoice } from './components/exercises/MultipleChoice';")

render_statement = """                  {(activeMode === 'map' || (activeMode === 'review-errors' && currentQuestion.type === 'map')) && (
                    <MapQuizPlayer question={currentQuestion} onResult={handleResultSubmit} language={language} />
                  )}"""

if "<MapQuizPlayer" not in content:
    content = content.replace(
        "{(activeMode === 'multiple-choice' || (activeMode === 'review-errors' && currentQuestion.type === 'multiple-choice')) && (",
        render_statement + "\n                  {(activeMode === 'multiple-choice' || (activeMode === 'review-errors' && currentQuestion.type === 'multiple-choice')) && ("
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)

