import re
with open('src/components/exercises/MapQuizPlayer.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "language?: Language;",
    "language?: Language;\n  allowedItemIds?: string[];"
)

content = content.replace(
    "export const MapQuizPlayer: React.FC<MapQuizPlayerProps> = ({ question, onResult, language }) => {",
    "export const MapQuizPlayer: React.FC<MapQuizPlayerProps> = ({ question, onResult, language, allowedItemIds }) => {"
)

content = content.replace(
    "language={language}",
    "language={language}\n            allowedItemIds={allowedItemIds}"
)

with open('src/components/exercises/MapQuizPlayer.tsx', 'w') as f:
    f.write(content)
