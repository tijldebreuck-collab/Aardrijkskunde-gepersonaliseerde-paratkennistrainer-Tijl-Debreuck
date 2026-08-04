import re
with open('src/components/EuropeMap.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "language?: Language;",
    "language?: Language;\n  allowedItemIds?: string[];"
)

content = content.replace(
    "export default function EuropeMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl' }: EuropeMapProps) {",
    "export default function EuropeMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl', allowedItemIds }: EuropeMapProps) {"
)

# RIVERS
content = content.replace("europeRivers.map(river => {", "europeRivers.filter(r => !allowedItemIds || allowedItemIds.includes(r.id)).map(river => {")

# MOUNTAINS
content = content.replace("europeMountains.map(mount => {", "europeMountains.filter(m => !allowedItemIds || allowedItemIds.includes(m.id)).map(mount => {")

# CAPITALS
content = content.replace("(europeJSON.countries || []).map((country: any) => {", "(europeJSON.countries || []).filter((country: any) => !allowedItemIds || allowedItemIds.includes(country.id)).map((country: any) => {")

# CITIES
# wait, EuropeMap doesn't have cities yet. I should add them if they exist.
if "(europeJSON.steden || []).map" in content:
    content = content.replace("(europeJSON.steden || []).map((city: any) => {", "(europeJSON.steden || []).filter((city: any) => !allowedItemIds || allowedItemIds.includes(city.id)).map((city: any) => {")

# Countries clickability
content = content.replace("onClick={showCountries ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}", "onClick={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}")
content = content.replace("onMouseEnter={showCountries ? () => setHoveredItem(mappedId) : undefined}", "onMouseEnter={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(mappedId) : undefined}")
content = content.replace("onMouseLeave={showCountries ? () => setHoveredItem(null) : undefined}", "onMouseLeave={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(null) : undefined}")

# Labels
content = content.replace(
    "const shouldShowLabel = showCountries && ((!interactiveMode && showLabels) || isWrong || clickedItem === mappedId || isTheCorrectOne);",
    "const shouldShowLabel = showCountries && ((!allowedItemIds || allowedItemIds.includes(mappedId))) && ((!interactiveMode && showLabels) || isWrong || clickedItem === mappedId || isTheCorrectOne);"
)

with open('src/components/EuropeMap.tsx', 'w') as f:
    f.write(content)
