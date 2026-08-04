import json
import re

with open('world-atlas-countries.json', 'r') as f:
    world_atlas = json.load(f)

# Extract translations from language.ts
with open('src/utils/language.ts', 'r') as f:
    lang_content = f.read()

# We need to parse: "Dutch": "English",
matches = re.findall(r'"([^"]+)":\s*"([^"]+)"', lang_content)
en_to_nl = {en: nl for nl, en in matches}

atlas_features = world_atlas['objects']['countries']['geometries']

countryIdMap_lines = ["const countryIdMap: Record<number, string> = {"]
world_json_countries = []

for geom in atlas_features:
    if 'id' not in geom: continue
    code = int(geom['id'])
    name_en = geom['properties']['name']
    
    name_nl = en_to_nl.get(name_en, name_en)
    
    # special cases
    if name_en == 'United States of America': name_nl = 'Verenigde Staten'
    
    cid = f"wd-l-{code}"
    countryIdMap_lines.append(f'  {code}: "{cid}", // {name_en}')
    world_json_countries.append({
        "id": cid,
        "name": name_nl,
        "category": "country"
    })

countryIdMap_lines.append("};")

with open('countryIdMap_new.ts', 'w') as f:
    f.write('\n'.join(countryIdMap_lines))

with open('src/data/world.json', 'r') as f:
    world_data = json.load(f)

world_data['countries'] = world_json_countries

with open('src/data/world.json', 'w') as f:
    json.dump(world_data, f, indent=2)

