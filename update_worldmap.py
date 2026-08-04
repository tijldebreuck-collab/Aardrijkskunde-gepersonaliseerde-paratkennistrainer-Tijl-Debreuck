import re
with open('src/components/WorldMap.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "language?: Language;",
    "language?: Language;\n  allowedItemIds?: string[];"
)

content = content.replace(
    "export default function WorldMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl' }: WorldMapProps) {",
    "export default function WorldMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl', allowedItemIds }: WorldMapProps) {"
)

# For countries
# We still map over them, but maybe change styling or clickability?
# Wait! "wat niet aangeduid staat in die map moet dan ook niet worden weergegeven op de kaar voor verwaring te vermijden."
# If I don't draw the background countries, it's just a blank space. I should draw them, but maybe only make them clickable / labeled if they are in allowedItemIds!
# But for Rivers, Mountains, Cities, Capitals, we should ONLY render them if they are in allowedItemIds!

# RIVERS
rivers_start = "            {showRivers && worldRivers.map(river => {"
rivers_end = "            })}"
# I'll just change `worldRivers.map` to `worldRivers.filter(r => !allowedItemIds || allowedItemIds.includes(r.id)).map`
content = content.replace("worldRivers.map(river => {", "worldRivers.filter(r => !allowedItemIds || allowedItemIds.includes(r.id)).map(river => {")

# MOUNTAINS
content = content.replace("worldMountains.map(mount => {", "worldMountains.filter(m => !allowedItemIds || allowedItemIds.includes(m.id)).map(mount => {")

# CAPITALS
# Wait, capitals are derived from countries!
content = content.replace("(worldJSON.countries || []).map((country: any) => {", "(worldJSON.countries || []).filter((country: any) => !allowedItemIds || allowedItemIds.includes(country.id)).map((country: any) => {")

# CITIES
content = content.replace("(worldJSON.steden || []).map((city: any) => {", "(worldJSON.steden || []).filter((city: any) => !allowedItemIds || allowedItemIds.includes(city.id)).map((city: any) => {")

# What about the clickable countries?
# Clickable countries are currently filtered for drawing. Wait, the background is all countries. 
# `onClick={showCountries ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}`
# Let's change this to check `allowedItemIds`:
content = content.replace("onClick={showCountries ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}", "onClick={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}")
content = content.replace("onMouseEnter={showCountries ? () => setHoveredItem(mappedId) : undefined}", "onMouseEnter={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(mappedId) : undefined}")
content = content.replace("onMouseLeave={showCountries ? () => setHoveredItem(null) : undefined}", "onMouseLeave={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(null) : undefined}")

# We should also only show labels for allowed countries
content = content.replace(
    "const shouldShowLabel = showCountries && ((!interactiveMode && showLabels) || isWrong || clickedItem === mappedId || isTheCorrectOne);",
    "const shouldShowLabel = showCountries && ((!allowedItemIds || allowedItemIds.includes(mappedId))) && ((!interactiveMode && showLabels) || isWrong || clickedItem === mappedId || isTheCorrectOne);"
)

with open('src/components/WorldMap.tsx', 'w') as f:
    f.write(content)

