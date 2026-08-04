with open('src/App.tsx', 'r') as f:
    content = f.read()

import_statement = "import { MapQuizPlayer } from './components/exercises/MapQuizPlayer';\n"
if "import { MapQuizPlayer }" not in content:
    content = content.replace("import MultipleChoice from './components/exercises/MultipleChoice';", import_statement + "import MultipleChoice from './components/exercises/MultipleChoice';")

with open('src/App.tsx', 'w') as f:
    f.write(content)
