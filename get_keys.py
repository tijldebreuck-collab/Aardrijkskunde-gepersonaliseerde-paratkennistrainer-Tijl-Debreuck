import json
with open('src/data/europe.json', 'r') as f:
    data = json.load(f)
print(data.keys())
