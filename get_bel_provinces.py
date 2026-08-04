import json

with open('ne_provinces.json', 'r') as f:
    data = json.load(f)

bel_features = [f for f in data['features'] if f['properties'].get('admin') == 'Belgium']

print(f"Found {len(bel_features)} features for Belgium.")
for f in bel_features:
    print(f['properties'].get('name'), f['properties'].get('type_en'))

with open('bel_provinces_ne.json', 'w') as out:
    json.dump({"type": "FeatureCollection", "features": bel_features}, out)

