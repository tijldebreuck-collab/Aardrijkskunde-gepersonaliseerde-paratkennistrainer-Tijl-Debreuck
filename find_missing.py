import json

with open('all_names.json', 'r') as f:
    all_names = set(json.load(f))

def get_names_from_json(filename):
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
            names = set()
            for key, val in data.items():
                if isinstance(val, list):
                    for item in val:
                        if 'name' in item:
                            names.add(item['name'])
            return names
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return set()

world_names = get_names_from_json('src/data/world.json')
europe_names = get_names_from_json('src/data/europe.json')
belgium_names = get_names_from_json('src/data/belgium.json')

# geoData.ts has worldCapitals, worldRivers, etc.
import re
with open('src/data/geoData.ts', 'r') as f:
    geo_content = f.read()
    geo_names = set(re.findall(r'name:\s*"([^"]+)"', geo_content))
    geo_names.update(re.findall(r"name:\s*'([^']+)'", geo_content))

all_existing_names = world_names | europe_names | belgium_names | geo_names

missing = all_names - all_existing_names

print(f"Total requested names: {len(all_names)}")
print(f"Total missing names: {len(missing)}")
for name in sorted(list(missing)):
    print(name)

