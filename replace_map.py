import re

with open('src/components/WorldMap.tsx', 'r') as f:
    content = f.read()

with open('countryIdMap_new.ts', 'r') as f:
    new_map = f.read()

# Replace the old countryIdMap definition with the new one
pattern = re.compile(r'const countryIdMap: Record<number, string> = \{.*?\};', re.DOTALL)
new_content = pattern.sub(new_map, content)

with open('src/components/WorldMap.tsx', 'w') as f:
    f.write(new_content)

