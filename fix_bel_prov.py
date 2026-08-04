import json

with open('src/data/belgium-provinces.json', 'r') as f:
    data = json.load(f)

# The expected IDs in belgium.json:
# "be-p-wvl" -> West-Vlaanderen
# "be-p-ovl" -> Oost-Vlaanderen
# "be-p-ant" -> Antwerpen
# "be-p-lim" -> Limburg
# "be-p-vbr" -> Vlaams-Brabant
# "be-p-hng" -> Henegouwen
# "be-p-wbr" -> Waals-Brabant
# "be-p-nam" -> Namen
# "be-p-lie" -> Luik
# "be-p-lux" -> Luxemburg
# "be-p-bru" -> Brussels Hoofdstedelijk Gewest

name_to_id = {
    "Bruxelles": ("be-p-bru", "Brussels Hoofdstedelijk Gewest"),
    "Antwerpen": ("be-p-ant", "Antwerpen"),
    "Limburg": ("be-p-lim", "Limburg"),
    "Oost-Vlaanderen": ("be-p-ovl", "Oost-Vlaanderen"),
    "Vlaams Brabant": ("be-p-vbr", "Vlaams-Brabant"),
    "West-Vlaanderen": ("be-p-wvl", "West-Vlaanderen"),
    "Brabant Wallon": ("be-p-wbr", "Waals-Brabant"),
    "Hainaut": ("be-p-hng", "Henegouwen"),
    "Liège": ("be-p-lie", "Luik"),
    "Luxembourg": ("be-p-lux", "Luxemburg"),
    "Namur": ("be-p-nam", "Namen")
}

for f in data['features']:
    orig_name = f['properties']['NAME_2']
    if orig_name in name_to_id:
        f['id'] = name_to_id[orig_name][0]
        f['properties']['name'] = name_to_id[orig_name][1]

with open('src/data/belgium-provinces.json', 'w') as f:
    json.dump(data, f)

