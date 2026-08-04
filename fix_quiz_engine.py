import re
with open('src/hooks/useQuizEngine.ts', 'r') as f:
    content = f.read()

# I need to add support for currentMode === 'map'
# Search for `} else if (currentMode === 'fill-in') {`
# And add `} else if (currentMode === 'map') { ...` right before it

map_mode = """    } else if (currentMode === 'map') {
      if (currentCategory === 'capital' || (questionSubType as string) === 'capital' || (currentCategory === 'country' && questionSubType === 'capital') || (currentCategory === 'province' && questionSubType === 'capital')) {
        const entityName = translateName(targetItem.name || (targetItem as any).naam || '', language);
        text = language === 'en' 
          ? `What is the capital of ${entityName}?` 
          : `Wat is de hoofdstad van ${entityName}?`;
        correctAnswer = translateName(targetItem.capital || '', language);
      } else {
        const translatedName = translateName(targetItem.name || (targetItem as any).naam || '', language);
        text = language === 'en' 
          ? `Find: ${translatedName}` 
          : `Zoek: ${translatedName}`;
        correctAnswer = translatedName;
      }
"""

content = content.replace("    } else if (currentMode === 'fill-in') {", map_mode + "    } else if (currentMode === 'fill-in') {")

with open('src/hooks/useQuizEngine.ts', 'w') as f:
    f.write(content)

