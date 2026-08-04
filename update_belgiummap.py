import re
with open('src/components/BelgiumMap.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "language?: Language;",
    "language?: Language;\n  allowedItemIds?: string[];"
)

content = content.replace(
    "export default function BelgiumMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl' }: BelgiumMapProps) {",
    "export default function BelgiumMap({ activeQuestion, onResult, interactiveMode = false, showCorrectAnswer = false, wrongItems = [], language = 'nl', allowedItemIds }: BelgiumMapProps) {"
)

# RIVERS
content = content.replace("belgiumRivers.map((river: any, i: number) => {", "belgiumRivers.filter((r: any) => !allowedItemIds || allowedItemIds.includes(r.id)).map((river: any, i: number) => {")

# MOUNTAINS
content = content.replace("belgiumMountains.map((mount: any, i: number) => {", "belgiumMountains.filter((m: any) => !allowedItemIds || allowedItemIds.includes(m.id)).map((mount: any, i: number) => {")

# CAPITALS
content = content.replace("(belgiumJSON.provinces || []).map((prov: any) => {", "(belgiumJSON.provinces || []).filter((prov: any) => !allowedItemIds || allowedItemIds.includes(prov.id)).map((prov: any) => {")

# Provinces clickability
content = content.replace("onClick={showProvinces ? (e) => handleEntityClick(prov.id, provinceName, e) : undefined}", "onClick={(showProvinces && (!allowedItemIds || allowedItemIds.includes(prov.id))) ? (e) => handleEntityClick(prov.id, provinceName, e) : undefined}")
content = content.replace("onMouseEnter={showProvinces ? () => setHoveredItem(prov.id) : undefined}", "onMouseEnter={(showProvinces && (!allowedItemIds || allowedItemIds.includes(prov.id))) ? () => setHoveredItem(prov.id) : undefined}")
content = content.replace("onMouseLeave={showProvinces ? () => setHoveredItem(null) : undefined}", "onMouseLeave={(showProvinces && (!allowedItemIds || allowedItemIds.includes(prov.id))) ? () => setHoveredItem(null) : undefined}")

# Labels
content = content.replace(
    "const shouldShowLabel = showProvinces && ((!interactiveMode && showLabels) || isWrong || clickedItem === prov.id || isTheCorrectOne);",
    "const shouldShowLabel = showProvinces && ((!allowedItemIds || allowedItemIds.includes(prov.id))) && ((!interactiveMode && showLabels) || isWrong || clickedItem === prov.id || isTheCorrectOne);"
)

with open('src/components/BelgiumMap.tsx', 'w') as f:
    f.write(content)
