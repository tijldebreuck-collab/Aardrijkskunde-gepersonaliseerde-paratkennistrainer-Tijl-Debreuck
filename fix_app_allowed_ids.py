import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add allowedIds to MapQuizPlayer
# 1. find the activeFolder mapping
mapping_code = """
  const activeCustomFolder = preferences.activeFolderId ? preferences.customFolders?.find(f => f.id === preferences.activeFolderId) : null;
  const allowedItemIds = activeCustomFolder ? activeCustomFolder.items.map(i => i.id) : undefined;
"""

if "const allowedItemIds" not in content:
    content = content.replace("  const startMyLearningQuiz =", mapping_code + "\n  const startMyLearningQuiz =")

# 2. pass allowedItemIds to MapQuizPlayer
content = content.replace(
    "<MapQuizPlayer question={currentQuestion} onResult={handleResultSubmit} language={language} />",
    "<MapQuizPlayer question={currentQuestion} onResult={handleResultSubmit} language={language} allowedItemIds={allowedItemIds} />"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
