import json

with open('world-atlas-countries.json', 'r') as f:
    world_atlas = json.load(f)

# Build map from numeric ID to name
atlas_countries = []
for geom in world_atlas['objects']['countries']['geometries']:
    if 'id' in geom:
        num_id = int(geom['id'])
        name = geom['properties']['name']
        atlas_countries.append({'id': num_id, 'name': name})

# Let's generate a dictionary of wd-l-{num_id}
countryIdMap_lines = ["const countryIdMap: Record<number, string> = {"]
world_json_countries = []

for c in atlas_countries:
    code = c['id']
    name = c['name']
    # special cases or generic id
    cid = f"wd-l-{code}"
    countryIdMap_lines.append(f'  {code}: "{cid}", // {name}')
    world_json_countries.append({
        "id": cid,
        "name": name,
        "category": "country"
    })
countryIdMap_lines.append("};")

print(f"Generated {len(world_json_countries)} countries.")

# Update world.json
with open('src/data/world.json', 'r') as f:
    world_data = json.load(f)

world_data['countries'] = world_json_countries

with open('src/data/world.json', 'w') as f:
    json.dump(world_data, f, indent=2)

with open('countryIdMap_new.ts', 'w') as f:
    f.write('\n'.join(countryIdMap_lines))

