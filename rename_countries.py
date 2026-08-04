import json

with open('src/data/world.json', 'r') as f:
    world_data = json.load(f)

for c in world_data['countries']:
    name = c['name']
    if name == 'Dem. Rep. Congo': c['name'] = 'D.R. Congo'
    if name == "Côte d'Ivoire": c['name'] = 'Ivoorkust'
    if name == 'Sudan': c['name'] = 'Soedan en Zuid-Soedan' # just merge them, or rename one and delete the other
    if name == 'S. Sudan': c['name'] = 'Zuid-Soedan' # Or remove it if we merged it.

with open('src/data/world.json', 'w') as f:
    json.dump(world_data, f, indent=2)

