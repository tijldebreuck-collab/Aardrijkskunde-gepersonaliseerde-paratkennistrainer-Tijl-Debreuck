export interface GeoFeature {
  id: string;
  name: string;
  category: 'river' | 'mountain' | 'capital' | 'country' | 'province' | 'highway' | 'city' | 'sea' | 'ocean';
  coordinates?: [number, number]; // [lon, lat] for capital points / interaction anchors
  coordinatesList?: [number, number][]; // [lon, lat][] line path for rivers
  polygon?: [number, number][]; // Polygon coordinates for mountains/custom regions
  alternatives?: string[];
  difficulty?: 'makkelijk' | 'gemiddeld' | 'moeilijk' | string;
}

// --- WORLD DATA ---

export const worldCapitals: GeoFeature[] = [
  { id: "wd-s-nyo", name: "New York", category: "capital", coordinates: [-74.006, 40.7128], difficulty: "gemiddeld" }, // represent city coordinate
  { id: "wd-s-was", name: "Washington DC", category: "capital", coordinates: [-77.0369, 38.9072], difficulty: "gemiddeld" },
  { id: "wd-l-can", name: "Ottawa", category: "capital", coordinates: [-75.6972, 45.4215], difficulty: "gemiddeld" },
  { id: "wd-l-mex", name: "Mexico Stad", category: "capital", coordinates: [-99.1332, 19.4326], difficulty: "gemiddeld" },
  { id: "wd-l-cub", name: "Havana", category: "capital", coordinates: [-82.3666, 23.1136], difficulty: "gemiddeld" },
  { id: "wd-l-bra", name: "Brasilia", category: "capital", coordinates: [-47.9292, -15.7801], difficulty: "gemiddeld" },
  { id: "wd-l-ven", name: "Caracas", category: "capital", coordinates: [-66.9036, 10.4806], difficulty: "gemiddeld" },
  { id: "wd-l-col", name: "Bogota", category: "capital", coordinates: [-74.0721, 4.7110], difficulty: "gemiddeld" },
  { id: "wd-l-per", name: "Lima", category: "capital", coordinates: [-77.0428, -12.0464], difficulty: "gemiddeld" },
  { id: "wd-l-chi", name: "Santiago", category: "capital", coordinates: [-70.6693, -33.4489], difficulty: "gemiddeld" },
  { id: "wd-l-arg", name: "Buenos Aires", category: "capital", coordinates: [-58.3816, -34.6037], difficulty: "gemiddeld" },
  { id: "wd-l-egy", name: "Cairo", category: "capital", coordinates: [31.2357, 30.0444], difficulty: "gemiddeld" },
  { id: "wd-l-alg", name: "Algiers", category: "capital", coordinates: [3.0588, 36.7538], difficulty: "gemiddeld" },
  { id: "wd-l-lby", name: "Tripoli", category: "capital", coordinates: [13.1913, 32.8872], difficulty: "gemiddeld" },
  { id: "wd-l-mar", name: "Rabat", category: "capital", coordinates: [-6.8498, 33.9716], difficulty: "gemiddeld" },
  { id: "wd-l-tun", name: "Tunis", category: "capital", coordinates: [10.1815, 36.8065], difficulty: "gemiddeld" },
  { id: "wd-l-som", name: "Mogadishu", category: "capital", coordinates: [45.3182, 2.0469], difficulty: "gemiddeld" },
  { id: "wd-l-eth", name: "Addis Abeba", category: "capital", coordinates: [38.7578, 9.0192], difficulty: "gemiddeld" },
  { id: "wd-l-sud", name: "Khartoem", category: "capital", coordinates: [32.5599, 15.5007], difficulty: "gemiddeld" },
  { id: "wd-l-ken", name: "Nairobi", category: "capital", coordinates: [36.8219, -1.2921], difficulty: "gemiddeld" },
  { id: "wd-l-rwa", name: "Kigali", category: "capital", coordinates: [30.0619, -1.9441], difficulty: "gemiddeld" },
  { id: "wd-l-bur", name: "Gitega", category: "capital", coordinates: [29.9246, -3.4273], difficulty: "gemiddeld" },
  { id: "wd-l-mli", name: "Bamako", category: "capital", coordinates: [-8.0026, 12.6392], difficulty: "gemiddeld" },
  { id: "wd-l-nga", "name": "Abuja", category: "capital", coordinates: [7.4951, 9.0765] },
  { id: "wd-l-civ", "name": "Yamoussoukro", category: "capital", coordinates: [-5.2740, 6.8113] },
  { id: "wd-l-sen", "name": "Dakar", category: "capital", coordinates: [-17.4467, 14.6928] },
  { id: "wd-l-cod", "name": "Kinshasa", category: "capital", coordinates: [15.3101, -4.3276] },
  { id: "wd-l-zaf", "name": "Pretoria", category: "capital", coordinates: [28.1881, -25.7479] },
  { id: "wd-l-rus", "name": "Moskou", category: "capital", coordinates: [37.6173, 55.7558] },
  { id: "wd-l-ukr", "name": "Kiev", category: "capital", coordinates: [30.5234, 50.4501] },
  { id: "wd-l-pak", "name": "Islamabad", category: "capital", coordinates: [73.0479, 33.6844] },
  { id: "wd-l-afg", "name": "Kabul", category: "capital", coordinates: [69.2075, 34.5553] },
  { id: "wd-l-syr", "name": "Damascus", category: "capital", coordinates: [36.2913, 33.5138] },
  { id: "wd-l-isr", "name": "Jeruzalem", category: "capital", coordinates: [35.2137, 31.7683] },
  { id: "wd-l-idn", "name": "Jakarta", category: "capital", coordinates: [106.8456, -6.2115] },
  { id: "wd-l-phl", "name": "Manilla", category: "capital", coordinates: [120.9842, 14.5995] },
  { id: "wd-l-tha", "name": "Bangkok", category: "capital", coordinates: [100.5018, 13.7563] },
  { id: "wd-l-lbn", "name": "Beiroet", category: "capital", coordinates: [35.5018, 33.8938] },
  { id: "wd-l-jor", "name": "Amman", category: "capital", coordinates: [35.9284, 31.9454] },
  { id: "wd-l-sau", "name": "Riyad", category: "capital", coordinates: [46.7154, 24.7136] },
  { id: "wd-l-ind", "name": "New Delhi", category: "capital", coordinates: [77.2090, 28.6139] },
  { id: "wd-l-chn", "name": "Beijing", category: "capital", coordinates: [116.4074, 39.9042] },
  { id: "wd-l-jpn", "name": "Tokyo", category: "capital", coordinates: [139.6917, 35.6762] },
  { id: "wd-l-sgp", "name": "Singapore", category: "capital", coordinates: [103.8198, 1.3521] },
  { id: "wd-s-ank", "name": "Ankara", category: "capital", coordinates: [32.8597, 39.9334] },
  { id: "wd-s-bag", "name": "Bagdad", category: "capital", coordinates: [44.3615, 33.3152] },
  { id: "wd-l-aus-country", "name": "Canberra", category: "capital", coordinates: [149.1300, -35.2809] },
  { id: "wd-l-nzl", "name": "Wellington", category: "capital", coordinates: [174.7762, -41.2865] }
];

export const worldRivers: GeoFeature[] = [
  {
    id: "wd-r-nijl",
    name: "Nijl",
    category: "river",
    coordinates: [31.5, 20.0],
    coordinatesList: [[31.2, 30.1], [32.5, 23.5], [32.5, 15.6], [31.5, 10.0], [33.5, 2.0]]
  },
  {
    id: "wd-r-amazone",
    name: "Amazone",
    category: "river",
    coordinates: [-60.0, -3.5],
    coordinatesList: [[-50.0, -0.1], [-55.0, -1.8], [-60.0, -3.4], [-65.0, -3.2], [-70.0, -4.5], [-73.5, -3.5]]
  },
  {
    id: "wd-r-mississippi",
    name: "Mississippi",
    category: "river",
    coordinates: [-91.0, 36.0],
    coordinatesList: [[-89.2, 29.1], [-91.2, 32.5], [-90.1, 38.6], [-92.5, 44.5], [-95.0, 47.0]]
  },
  {
    id: "wd-r-parana",
    name: "Paraná",
    category: "river",
    coordinates: [-52.0, -25.0],
    coordinatesList: [[-58.4, -34.6], [-60.7, -31.6], [-58.5, -27.4], [-54.6, -25.4], [-51.0, -20.0]]
  },
  {
    id: "wd-r-niger",
    name: "Niger",
    category: "river",
    coordinates: [2.0, 15.0],
    coordinatesList: [[6.2, 4.3], [6.5, 8.0], [4.5, 12.0], [0.1, 16.5], [-4.0, 16.0], [-8.0, 12.5]]
  },
  {
    id: "wd-r-kongo",
    name: "Kongo",
    category: "river",
    coordinates: [20.0, -1.0],
    coordinatesList: [[12.2, -6.1], [15.2, -4.3], [18.5, -0.5], [23.1, 0.5], [25.1, -1.5], [26.2, -5.0]]
  },
  {
    id: "wd-r-ob",
    name: "Ob",
    category: "river",
    coordinates: [75.0, 60.0],
    coordinatesList: [[73.0, 66.8], [70.0, 61.5], [78.0, 61.0], [82.0, 56.0], [85.0, 52.0]]
  },
  {
    id: "wd-r-jenisej",
    name: "Jenisej",
    category: "river",
    coordinates: [88.0, 60.5],
    coordinatesList: [[86.5, 71.5], [89.0, 65.0], [90.0, 56.0], [92.0, 52.0]]
  },
  {
    id: "wd-r-lena",
    name: "Lena",
    category: "river",
    coordinates: [122.0, 62.0],
    coordinatesList: [[126.5, 72.0], [123.0, 66.0], [120.0, 60.0], [105.0, 54.0]]
  },
  {
    id: "wd-r-huanghe",
    name: "Huanghe",
    category: "river",
    coordinates: [110.0, 38.0],
    coordinatesList: [[119.3, 37.8], [115.0, 36.0], [111.0, 35.5], [110.0, 40.0], [106.0, 37.0], [100.0, 36.0]]
  },
  {
    id: "wd-r-jangtsekiang",
    name: "Jangtsekiang",
    category: "river",
    coordinates: [112.0, 30.0],
    coordinatesList: [[121.5, 31.3], [118.5, 32.0], [115.0, 30.0], [112.0, 30.5], [104.5, 28.5], [99.0, 27.0]]
  },
  {
    id: "wd-r-ganges",
    name: "Ganges",
    category: "river",
    coordinates: [84.0, 25.0],
    coordinatesList: [[89.5, 22.5], [88.0, 24.0], [85.0, 25.5], [80.0, 28.5], [78.5, 30.5]]
  },
  {
    id: "wd-r-darling",
    name: "Darling",
    category: "river",
    coordinates: [142.0, -32.0],
    coordinatesList: [[139.0, -34.0], [141.5, -32.5], [144.5, -30.0], [148.0, -28.0]]
  }
];

export const worldMountains: GeoFeature[] = [
  {
    id: "wd-m-himalaya",
    name: "Himalaya",
    category: "mountain",
    coordinates: [84.0, 28.5],
    polygon: [[73.5, 35.5], [77.0, 32.5], [82.0, 29.5], [88.0, 27.8], [95.0, 28.2], [96.5, 29.5], [94.5, 27.0], [87.5, 26.5], [81.5, 28.0], [76.5, 31.0], [73.5, 35.5]]
  },
  {
    id: "wd-m-andes",
    name: "Andes",
    category: "mountain",
    coordinates: [-71.0, -22.0],
    polygon: [[-73.5, 10.5], [-76.5, 5.0], [-79.0, -2.0], [-78.0, -10.0], [-74.0, -18.0], [-69.5, -28.0], [-71.5, -42.0], [-73.5, -53.0], [-69.5, -54.0], [-68.5, -41.0], [-67.0, -26.0], [-70.5, -16.0], [-75.0, -8.0], [-74.5, 2.0], [-71.5, 10.5], [-73.5, 10.5]]
  },
  {
    id: "wd-m-rocky",
    name: "Rocky Mountains",
    category: "mountain",
    coordinates: [-111.0, 44.0],
    polygon: [[-125.0, 62.0], [-119.0, 53.0], [-112.0, 45.0], [-106.0, 37.0], [-104.5, 33.5], [-108.0, 33.5], [-111.5, 39.0], [-116.0, 47.0], [-122.0, 56.0], [-127.0, 62.0], [-125.0, 62.0]]
  },
  {
    id: "wd-m-atlas",
    name: "Atlas",
    category: "mountain",
    coordinates: [-5.0, 32.0],
    polygon: [[-9.5, 30.5], [-6.5, 31.8], [-2.0, 33.5], [3.0, 35.2], [8.5, 36.8], [8.0, 35.5], [2.0, 34.0], [-4.0, 31.8], [-8.5, 29.8], [-9.5, 30.5]]
  },
  {
    id: "wd-m-madre",
    name: "Sierra Madre",
    category: "mountain",
    coordinates: [-102.0, 22.0],
    polygon: [[-109.0, 29.0], [-105.5, 24.5], [-100.5, 19.5], [-95.5, 16.5], [-94.0, 15.5], [-97.5, 15.2], [-102.0, 18.5], [-107.5, 24.0], [-110.5, 28.5], [-109.0, 29.0]]
  },
  {
    id: "wd-m-oeral",
    name: "Oeral",
    category: "mountain",
    coordinates: [60.0, 60.0],
    polygon: [[58.5, 68.5], [60.2, 64.0], [59.5, 58.0], [58.8, 53.0], [61.2, 51.5], [61.8, 56.5], [61.5, 63.5], [60.5, 68.5], [58.5, 68.5]]
  },
  {
    id: "wd-m-kunlun",
    name: "Kunlun (Shan)",
    category: "mountain",
    coordinates: [85.0, 36.0],
    polygon: [[76.0, 36.5], [82.0, 36.0], [90.0, 36.2], [98.0, 35.5], [97.5, 34.2], [89.5, 34.8], [81.5, 34.5], [75.8, 35.2], [76.0, 36.5]]
  },
  {
    id: "wd-m-tibet",
    name: "Hoogland van Tibet",
    category: "mountain",
    coordinates: [88.0, 33.0],
    polygon: [[78.0, 35.0], [88.0, 36.0], [98.0, 34.0], [101.0, 30.0], [95.0, 28.0], [85.0, 28.5], [79.0, 31.0], [78.0, 35.0]]
  },
  {
    id: "wd-m-eafrika",
    name: "Oost-Afrikaans Hoogland",
    category: "mountain",
    coordinates: [35.0, -3.0],
    polygon: [[30.0, 4.0], [35.0, 2.0], [37.0, -3.0], [35.0, -10.0], [31.0, -12.0], [30.0, -5.0], [31.0, 1.0], [30.0, 4.0]]
  },
  {
    id: "wd-m-coastrange",
    name: "Coast Range (Kustgebergte)",
    category: "mountain",
    coordinates: [-126.0, 54.0],
    polygon: [[-135.0, 60.0], [-130.0, 56.0], [-124.0, 50.0], [-121.0, 45.0], [-122.5, 45.0], [-126.0, 51.0], [-132.0, 57.0], [-136.0, 60.5], [-135.0, 60.0]]
  },
  {
    id: "wd-m-taurus",
    name: "Taurus",
    category: "mountain",
    coordinates: [33.0, 37.5],
    polygon: [[28.5, 36.8], [31.5, 37.2], [35.0, 38.0], [38.5, 38.5], [38.0, 37.5], [34.5, 36.8], [31.0, 36.2], [28.5, 36.8]]
  },
  {
    id: "wd-m-iran",
    name: "Hoogland van Iran",
    category: "mountain",
    coordinates: [54.0, 32.0],
    polygon: [[46.0, 37.0], [51.0, 36.5], [59.0, 37.5], [63.0, 31.0], [58.0, 27.0], [50.0, 29.0], [46.0, 33.0], [46.0, 37.0]]
  },
  {
    id: "wd-m-ethiopia",
    name: "Ethiopisch Hoogland",
    category: "mountain",
    coordinates: [38.0, 9.5],
    polygon: [[36.0, 14.0], [39.5, 14.5], [42.0, 10.0], [40.0, 6.0], [36.5, 5.5], [35.5, 8.5], [36.0, 14.0]]
  }
];

// --- EUROPE DATA ---

export const europeCapitals: GeoFeature[] = [
  { id: "eu-l-ned", name: "Amsterdam", category: "capital", coordinates: [4.9041, 52.3676], difficulty: "gemiddeld" },
  { id: "eu-l-bel", name: "Brussel", category: "capital", coordinates: [4.3517, 50.8503], difficulty: "makkelijk" },
  { id: "eu-l-lux", name: "Luxemburg", category: "capital", coordinates: [6.1296, 49.8153], difficulty: "gemiddeld" },
  { id: "eu-l-fra", name: "Parijs", category: "capital", coordinates: [2.3522, 48.8566], difficulty: "makkelijk" },
  { id: "eu-l-dui", name: "Berlijn", category: "capital", coordinates: [13.4050, 52.5200], difficulty: "makkelijk" },
  { id: "eu-l-gbr", name: "Londen", category: "capital", coordinates: [-0.1278, 51.5074], difficulty: "makkelijk" },
  { id: "eu-l-ier", name: "Dublin", category: "capital", coordinates: [-6.2603, 53.3498], difficulty: "gemiddeld" },
  { id: "eu-l-ita", name: "Rome", category: "capital", coordinates: [12.4964, 41.9028], difficulty: "makkelijk" },
  { id: "eu-l-spa", name: "Madrid", category: "capital", coordinates: [-3.7492, 40.4637], difficulty: "makkelijk" },
  { id: "eu-l-por", name: "Lissabon", category: "capital", coordinates: [-9.1393, 38.7223], difficulty: "gemiddeld" },
  { id: "eu-l-pol", name: "Warschau", category: "capital", coordinates: [21.0122, 52.2297], difficulty: "gemiddeld" },
  { id: "eu-l-tsj", name: "Praag", category: "capital", coordinates: [14.4378, 50.0755], difficulty: "gemiddeld" },
  { id: "eu-l-slo", name: "Bratislava", category: "capital", coordinates: [17.1077, 48.1486], difficulty: "gemiddeld" },
  { id: "eu-l-hon", name: "Boedapest", category: "capital", coordinates: [19.0402, 47.4979], difficulty: "gemiddeld" },
  { id: "eu-l-kro", name: "Zagreb", category: "capital", coordinates: [15.9819, 45.8150], difficulty: "gemiddeld" },
  { id: "eu-l-slv", name: "Ljubljana", category: "capital", coordinates: [14.5058, 46.0569], difficulty: "gemiddeld" },
  { id: "eu-l-ser", name: "Belgrado", category: "capital", coordinates: [20.4489, 44.7866], difficulty: "gemiddeld" },
  { id: "eu-l-mon", name: "Podgorica", category: "capital", coordinates: [19.2636, 42.4304], difficulty: "gemiddeld" },
  { id: "eu-l-kos", name: "Pristina", category: "capital", coordinates: [21.1655, 42.6629], difficulty: "gemiddeld" },
  { id: "eu-l-alb", name: "Tirana", category: "capital", coordinates: [19.8187, 41.3275], difficulty: "gemiddeld" },
  { id: "eu-l-bos", name: "Sarajevo", category: "capital", coordinates: [18.4131, 43.8563], difficulty: "gemiddeld" },
  { id: "eu-l-nma", name: "Skopje", category: "capital", coordinates: [21.4280, 41.9981], difficulty: "gemiddeld" },
  { id: "eu-l-gri", name: "Athene", category: "capital", coordinates: [23.7275, 37.9838], difficulty: "gemiddeld" },
  { id: "eu-l-bul", name: "Sofia", category: "capital", coordinates: [23.3219, 42.6977], difficulty: "gemiddeld" },
  { id: "eu-l-roe", name: "Boekarest", category: "capital", coordinates: [26.1025, 44.4268], difficulty: "gemiddeld" },
  { id: "eu-l-mol", name: "Chisinau", category: "capital", coordinates: [28.8638, 47.0105], difficulty: "gemiddeld" },
  { id: "eu-l-oek", name: "Kiev", category: "capital", coordinates: [30.5234, 50.4501], difficulty: "gemiddeld" },
  { id: "eu-l-wit", name: "Minsk", category: "capital", coordinates: [27.5615, 53.9006], difficulty: "gemiddeld" },
  { id: "eu-l-lit", name: "Vilnius", category: "capital", coordinates: [25.2797, 54.6872], difficulty: "gemiddeld" },
  { id: "eu-l-let", name: "Riga", category: "capital", coordinates: [24.1052, 56.9496], difficulty: "gemiddeld" },
  { id: "eu-l-est", name: "Tallinn", category: "capital", coordinates: [24.7535, 59.4370], difficulty: "gemiddeld" },
  { id: "eu-l-rus", name: "Moskou", category: "capital", coordinates: [37.6173, 55.7558], difficulty: "gemiddeld" },
  { id: "eu-l-mal", name: "Valletta", category: "capital", coordinates: [14.5146, 35.8989], difficulty: "gemiddeld" },
  { id: "eu-l-cyp", name: "Nicosia", category: "capital", coordinates: [33.3823, 35.1856], difficulty: "gemiddeld" },
  { id: "eu-l-oas", name: "Wenen", category: "capital", coordinates: [16.3738, 48.2082], difficulty: "gemiddeld" },
  { id: "eu-l-zwi-capital", name: "Bern", category: "capital", coordinates: [7.4474, 46.9480], difficulty: "gemiddeld" },
  { id: "eu-l-dan", name: "Kopenhagen", category: "capital", coordinates: [12.5683, 55.6761], difficulty: "gemiddeld" },
  { id: "eu-l-noo", name: "Oslo", category: "capital", coordinates: [10.7522, 59.9139], difficulty: "gemiddeld" },
  { id: "eu-l-zwe", name: "Stockholm", category: "capital", coordinates: [18.0686, 59.3293], difficulty: "gemiddeld" },
  { id: "eu-l-fin", name: "Helsinki", category: "capital", coordinates: [24.9384, 60.1699], difficulty: "gemiddeld" },
  { id: "eu-l-ijsl", name: "Reykjavik", category: "capital", coordinates: [-21.9426, 64.1466], difficulty: "gemiddeld" }
];

export const europeRivers: GeoFeature[] = [
  {
    id: "eu-r-rijn",
    name: "Rijn",
    category: "river",
    coordinates: [8.0, 50.0],
    coordinatesList: [[6.0, 51.9], [7.6, 50.4], [8.3, 49.0], [7.6, 47.6], [9.1, 46.8]]
  },
  {
    id: "eu-r-donau",
    name: "Donau",
    category: "river",
    coordinates: [19.0, 46.5],
    coordinatesList: [[29.0, 45.2], [27.0, 44.3], [22.5, 44.4], [20.2, 44.8], [19.0, 47.5], [16.5, 48.2], [12.1, 49.0], [9.0, 48.0]]
  },
  {
    id: "eu-r-seine",
    name: "Seine",
    category: "river",
    coordinates: [1.5, 49.0],
    coordinatesList: [[0.2, 49.4], [1.5, 49.2], [2.3, 48.8], [3.5, 48.2], [4.8, 47.5]]
  },
  {
    id: "eu-r-wolga",
    name: "Wolga",
    category: "river",
    coordinates: [46.0, 51.0],
    coordinatesList: [[48.0, 46.0], [44.8, 48.7], [46.0, 51.5], [49.0, 53.0], [49.0, 56.0], [41.0, 56.5], [34.0, 57.0]]
  },
  {
    id: "eu-r-loire",
    name: "Loire",
    category: "river",
    coordinates: [-1.5, 47.2],
    coordinatesList: [[-2.2, 47.3], [1.0, 47.8], [2.5, 47.4], [3.5, 46.5], [3.9, 44.5]]
  },
  {
    id: "eu-r-oder",
    name: "Oder",
    category: "river",
    coordinates: [14.5, 52.5],
    coordinatesList: [[14.6, 53.8], [14.2, 52.8], [14.8, 52.0], [17.0, 51.1], [18.0, 49.8]]
  },
  {
    id: "eu-r-dnjepr",
    name: "Dnjepr",
    category: "river",
    coordinates: [32.0, 48.0],
    coordinatesList: [[32.2, 46.5], [35.0, 47.8], [31.0, 50.5], [30.1, 52.3], [32.1, 54.8]]
  },
  {
    id: "eu-r-theems",
    name: "Theems",
    category: "river",
    coordinates: [0.0, 51.5],
    coordinatesList: [[1.0, 51.5], [0.5, 51.5], [-0.1, 51.5], [-1.0, 51.6], [-2.0, 51.7]]
  },
  {
    id: "eu-r-po",
    name: "Po",
    category: "river",
    coordinates: [10.5, 45.0],
    coordinatesList: [[12.5, 44.9], [11.5, 45.0], [9.5, 45.1], [7.5, 44.8]]
  },
  {
    id: "eu-r-ebro",
    name: "Ebro",
    category: "river",
    coordinates: [-0.5, 41.5],
    coordinatesList: [[0.8, 40.7], [-0.5, 41.3], [-1.5, 42.0], [-4.0, 43.0]]
  },
  {
    id: "eu-r-rhone",
    name: "Rhône",
    category: "river",
    coordinates: [4.8, 44.5],
    coordinatesList: [[4.8, 43.3], [4.8, 45.7], [6.0, 46.2], [7.5, 46.1], [8.0, 46.5]]
  },
  {
    id: "eu-r-taag",
    name: "Taag",
    category: "river",
    coordinates: [-6.8, 39.5],
    coordinatesList: [[-9.1, 38.7], [-8.0, 39.4], [-6.5, 39.7], [-4.0, 39.9], [-2.0, 40.5]]
  },
  {
    id: "eu-r-elbe",
    name: "Elbe",
    category: "river",
    coordinates: [11.5, 52.0],
    coordinatesList: [[8.7, 53.9], [10.0, 53.5], [12.0, 51.8], [14.0, 50.8], [15.5, 50.2]]
  }
];

export const europeMountains: GeoFeature[] = [
  {
    id: "eu-m-pyreneen",
    name: "Pyreneeën",
    category: "mountain",
    coordinates: [0.5, 42.6],
    polygon: [[-2.5, 43.4], [-1.5, 43.2], [0.0, 42.8], [1.8, 42.6], [3.2, 42.4], [3.1, 42.1], [1.5, 42.2], [-0.5, 42.5], [-2.2, 43.0], [-2.5, 43.4]]
  },
  {
    id: "eu-m-alpen",
    name: "Alpen",
    category: "mountain",
    coordinates: [9.5, 46.2],
    polygon: [[5.8, 43.5], [6.8, 45.2], [7.8, 46.4], [9.5, 47.3], [12.0, 47.6], [15.2, 47.8], [16.2, 47.0], [14.0, 46.0], [11.2, 45.8], [8.5, 44.5], [7.2, 43.8], [5.8, 43.5]]
  },
  {
    id: "eu-m-karpaten",
    name: "Karpaten",
    category: "mountain",
    coordinates: [23.5, 46.8],
    polygon: [[17.8, 49.6], [19.5, 49.3], [22.5, 49.0], [25.5, 48.2], [26.8, 46.5], [26.5, 45.5], [25.2, 45.2], [22.8, 44.7], [21.5, 44.9], [23.5, 45.8], [25.2, 46.8], [23.8, 48.2], [20.2, 48.8], [17.8, 49.6]]
  },
  {
    id: "eu-m-scandinavisch",
    name: "Scandinavisch Hoogland",
    category: "mountain",
    coordinates: [13.0, 63.5],
    polygon: [[5.5, 59.5], [6.5, 61.5], [10.5, 64.5], [15.0, 67.5], [20.0, 69.5], [24.0, 70.0], [21.0, 68.0], [15.5, 65.0], [11.5, 62.0], [7.5, 59.8], [5.5, 59.5]]
  },
  {
    id: "eu-m-kaukasus",
    name: "Kaukasus",
    category: "mountain",
    coordinates: [43.0, 42.8],
    polygon: [[37.5, 44.8], [40.2, 44.0], [44.5, 42.5], [48.2, 41.2], [47.5, 40.5], [43.8, 41.8], [39.8, 43.2], [37.5, 44.8]]
  },
  {
    id: "eu-m-oeral",
    name: "Oeral",
    category: "mountain",
    coordinates: [60.0, 60.0],
    polygon: [[58.5, 68.5], [60.2, 64.0], [59.5, 58.0], [58.8, 53.0], [61.2, 51.5], [61.8, 56.5], [61.5, 63.5], [60.5, 68.5], [58.5, 68.5]]
  }
];

// --- BELGIUM DATA ---

export const belgiumRivers: GeoFeature[] = [
  {
    id: "be-r-ijz",
    name: "IJzer",
    category: "river",
    coordinates: [2.65, 51.0],
    coordinatesList: [[2.54, 51.10], [2.65, 51.05], [2.75, 50.95], [2.60, 50.85]]
  },
  {
    id: "be-r-sch",
    name: "Schelde",
    category: "river",
    coordinates: [3.9, 51.0],
    coordinatesList: [[4.30, 51.35], [4.40, 51.25], [3.95, 51.05], [3.70, 51.05], [3.60, 50.80], [3.40, 50.50]]
  },
  {
    id: "be-r-maa",
    name: "Maas",
    category: "river",
    coordinates: [5.1, 50.45],
    coordinatesList: [[5.70, 51.20], [5.60, 50.85], [5.10, 50.45], [4.85, 50.45], [4.90, 50.25], [4.80, 50.00]]
  },
  {
    id: "be-r-lei",
    name: "Leie",
    category: "river",
    coordinates: [3.45, 50.85],
    coordinatesList: [[3.70, 51.05], [3.45, 50.85], [3.20, 50.70]]
  },
  {
    id: "be-r-samber",
    name: "Samber",
    category: "river",
    coordinates: [4.4, 50.4],
    coordinatesList: [[4.85, 50.45], [4.40, 50.40], [4.15, 50.30]]
  }
];

export const belgiumHighways: GeoFeature[] = [
  {
    id: "be-h-e40",
    name: "E40",
    category: "highway",
    coordinates: [3.70, 51.02],
    coordinatesList: [[2.55, 51.05], [3.10, 51.18], [3.70, 51.02], [4.05, 50.94], [4.35, 50.85], [4.70, 50.88], [5.55, 50.63], [6.00, 50.68]]
  },
  {
    id: "be-h-e403",
    name: "E403",
    category: "highway",
    coordinates: [3.10, 50.98],
    coordinatesList: [[3.22, 51.30], [3.20, 51.18], [3.10, 50.98], [3.25, 50.82], [3.38, 50.60]]
  },
  {
    id: "be-h-e17",
    name: "E17",
    category: "highway",
    coordinates: [3.72, 51.03],
    coordinatesList: [[4.40, 51.22], [4.15, 51.16], [3.72, 51.03], [3.28, 50.83], [3.18, 50.78]]
  },
  {
    id: "be-h-e19",
    name: "E19",
    category: "highway",
    coordinates: [4.45, 51.03],
    coordinatesList: [[4.42, 51.25], [4.45, 51.03], [4.35, 50.85], [4.32, 50.60], [3.95, 50.45], [3.78, 50.38]]
  },
  {
    id: "be-h-e411",
    name: "E411",
    category: "highway",
    coordinates: [4.86, 50.46],
    coordinatesList: [[4.38, 50.82], [4.60, 50.72], [4.86, 50.46], [5.10, 50.15], [5.80, 49.68]]
  },
  {
    id: "be-h-e42",
    name: "E42",
    category: "highway",
    coordinates: [4.44, 50.41],
    coordinatesList: [[3.38, 50.60], [3.95, 50.45], [4.44, 50.41], [4.86, 50.46], [5.56, 50.63], [6.12, 50.28]]
  },
  {
    id: "be-h-e313",
    name: "E313",
    category: "highway",
    coordinates: [4.75, 51.12],
    coordinatesList: [[4.42, 51.20], [4.75, 51.12], [5.33, 50.93], [5.60, 50.65]]
  },
  {
    id: "be-h-e314",
    name: "E314",
    category: "highway",
    coordinates: [5.05, 50.98],
    coordinatesList: [[4.70, 50.88], [5.05, 50.98], [5.50, 50.96], [5.70, 50.96]]
  },
  {
    id: "be-h-e34",
    name: "E34",
    category: "highway",
    coordinates: [4.85, 51.30],
    coordinatesList: [[4.40, 51.22], [4.90, 51.32], [5.15, 51.36]]
  },
  {
    id: "be-h-e25",
    name: "E25",
    category: "highway",
    coordinates: [5.70, 50.15],
    coordinatesList: [[5.68, 50.76], [5.56, 50.63], [5.65, 50.25], [5.72, 49.95], [5.80, 49.68]]
  }
];


export const belgiumMountains: GeoFeature[] = [
  { id: "be-m-bot", name: "Signal de Botrange", category: "mountain", coordinates: [6.0924, 50.5015] }
];

export const belgiumSeas: GeoFeature[] = [];

export const europeSeas: GeoFeature[] = [
  { id: "eu-s-noordzee", name: "Noordzee", category: "sea", coordinates: [3.0, 56.0] },
  { id: "eu-s-oostzee", name: "Oostzee", category: "sea", coordinates: [19.0, 57.5] },
  { id: "eu-s-middellandse", name: "Middellandse Zee", category: "sea", coordinates: [18.0, 35.5] },
  { id: "eu-s-zwarte", name: "Zwarte Zee", category: "sea", coordinates: [34.0, 43.5] },
  { id: "eu-s-kaspische", name: "Kaspische Zee", category: "sea", coordinates: [51.0, 41.5] },
  { id: "eu-s-ijszee", name: "Noordelijke IJszee", category: "sea", coordinates: [20.0, 72.0] },
  { id: "eu-s-adriatische", name: "Adriatische Zee", category: "sea", coordinates: [15.5, 42.8] },
  { id: "eu-s-ionische", name: "Ionische Zee", category: "sea", coordinates: [19.5, 38.0] },
  { id: "eu-s-egeische", name: "Egeïsche Zee", category: "sea", coordinates: [25.0, 38.0] },
  { id: "eu-s-tyrreense", name: "Tyrreense Zee", category: "sea", coordinates: [12.5, 39.5] },
  { id: "eu-s-ierse", name: "Ierse Zee", category: "sea", coordinates: [-5.2, 53.5] },
  { id: "eu-s-atlantische", name: "Atlantische Oceaan", category: "sea", coordinates: [-18.0, 50.0] },
  { id: "eu-s-bosporus", name: "Bosporus", category: "sea", coordinates: [29.1, 41.1] },
  { id: "eu-s-gibraltar", name: "Straat van Gibraltar", category: "sea", coordinates: [-5.6, 35.9] },
  { id: "eu-s-kanaal", name: "Het Kanaal", category: "sea", coordinates: [-1.2, 50.2] }
];

export const worldSeas: GeoFeature[] = [
  { id: "wd-oc-gro", name: "Grote Oceaan", category: "sea", coordinates: [-140.0, 0.0] },
  { id: "wd-oc-atl", name: "Atlantische Oceaan", category: "sea", coordinates: [-30.0, 15.0] },
  { id: "wd-oc-ind", name: "Indische Oceaan", category: "sea", coordinates: [75.0, -20.0] },
  { id: "wd-oc-nij", name: "Noordelijke IJszee", category: "sea", coordinates: [0.0, 80.0] },
  { id: "wd-s-middellandse", name: "Middellandse Zee", category: "sea", coordinates: [18.0, 35.5] },
  { id: "wd-s-caribische", name: "Caribische Zee", category: "sea", coordinates: [-75.0, 15.0] },
  { id: "wd-s-rode", name: "Rode Zee", category: "sea", coordinates: [38.0, 20.0] },
  { id: "wd-s-kaspische", name: "Kaspische Zee", category: "sea", coordinates: [51.0, 41.5] },
  { id: "wd-s-zwarte", name: "Zwarte Zee", category: "sea", coordinates: [34.0, 43.5] }
];
