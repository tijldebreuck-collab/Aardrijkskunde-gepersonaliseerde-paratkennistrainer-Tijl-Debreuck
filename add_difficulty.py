import json
import os
import random

def add_diff(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    for key, items in data.items():
        if isinstance(items, list):
            for item in items:
                if 'difficulty' not in item:
                    item['difficulty'] = 'gemiddeld' # Default
                    # Set easy for some things
                    if item.get('name', '').lower() in ['west-vlaanderen', 'antwerpen', 'brussel', 'frankrijk', 'nederland', 'duitsland', 'verenigd koninkrijk', 'spanje', 'italië']:
                        item['difficulty'] = 'makkelijk'
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

for f in os.listdir('src/data'):
    if f.endswith('.json'):
        add_diff(os.path.join('src/data', f))
        
print("Done")
