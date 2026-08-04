import json

with open('provinces_gui.geojson', 'r') as f:
    data = json.load(f)

for f in data['features']:
    print(f['properties'])

