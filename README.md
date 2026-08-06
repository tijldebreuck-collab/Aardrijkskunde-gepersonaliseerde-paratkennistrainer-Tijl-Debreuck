# Nederlands:
# 🌍 Aardrijkskunde Parate Kennis Trainer

> Een interactieve, databankgestuurde oefenapp voor aardrijkskunde in het 4e jaar secundair onderwijs — gebaseerd op de officiële cursusleerstof.

---

## Inhoud

- [Over het project](#over-het-project)
- [Functies](#functies)
- [Technologieën](#technologieën)
- [Projectstructuur](#projectstructuur)
- [Datasets](#datasets)
- [Oefenvormen](#oefenvormen)
- [Installatie & starten](#installatie--starten)
- [Online gebruiken (Chromebook)](#online-gebruiken-chromebook)
- [Datavalidatie](#datavalidatie)
- [Regels & architectuurprincipes](#regels--architectuurprincipes)
- [Uitbreiden](#uitbreiden)
- [Licentie](#licentie)

---

## Over het project

Deze applicatie is gebouwd als persoonlijk studiehulpmiddel voor het vak Aardrijkskunde in het 4e jaar secundair onderwijs (Belgisch leerplan). Ze laat je **parate kennis** oefenen — dat wil zeggen: geografische namen en locaties kennen zonder je atlas te raadplegen.

De app werkt op basis van **drie JSON-datasets** die de enige bron van waarheid zijn. Alle vragen, antwoorden, meerkeuzeopties en kaartvalidaties komen uitsluitend uit die bestanden. Er wordt nooit geografische kennis verzonnen of geraden.

**Modules:**
- 🇧🇪 **België** — provincies, hoofdsteden, gewesten, havens, rivieren, autosnelwegen
- 🌍 **Europa** — 41 landen + hoofdsteden, zeeën, rivieren, gebergten, eilanden
- 🗺️ **Wereld** — continenten, oceanen, 45 landen, 36 steden, rivieren, gebergten

---

## Functies

| Categorie | Wat je kunt oefenen |
|---|---|
| **Invuloefeningen** | Typ de naam van een land, hoofdstad, rivier of provincie |
| **Meerkeuze** | 4 opties, alle antwoorden uit de dataset |
| **Flashcards** | Voorkant/achterkant met 3D-omdraaianimatie |
| **Interactieve kaart** | Klik op het gevraagde land of de gevraagde provincie |
| **Tijdsuitdaging** | 30s / 60s / 2min / onbeperkt |
| **Spaced repetition** | Foutieve vragen komen vaker terug |
| **Voortgang** | Lokaal opgeslagen via `localStorage` |
| **Dark mode** | Automatisch en handmatig schakelbaar |
| **Datavalidatieresultaat** | Ingebouwd controlesysteem bij het opstarten |

---

## Technologieën

- **React 19** + **TypeScript** (strict mode)
- **Vite** — snelle build, ideaal voor StackBlitz/CodeSandbox
- **Tailwind CSS 4** — utility-first styling, glassmorphism-effecten
- **Framer Motion** — animaties (flashcard-flip, feedback, confetti)
- **React-Leaflet** — interactieve kaarten met GeoJSON
- **LocalStorage** — voortgang en scores lokaal bewaard
- **JSON** — enige bron van waarheid voor alle oefeningen

---

## Projectstructuur

```
src/
├── data/
│   ├── belgium.json          # 🇧🇪 Provincies, rivieren, havens, autosnelwegen
│   ├── europe.json           # 🌍 41 landen, zeeën, gebergten, eilanden
│   └── world.json            # 🗺️ 45 landen, 36 steden, oceanen, rivieren
│
├── types/
│   └── geography.ts          # TypeScript interfaces voor alle datatypes
│
├── utils/
│   ├── textUtils.ts          # Normalisatie (accenten, hoofdletters, spaties)
│   └── validation.ts         # Dataset-audit functie
│
├── hooks/
│   ├── useQuestionGenerator.ts  # Centrale quiz-engine (ENIGE bron van vragen)
│   └── useSpacedRepetition.ts   # SRS-algoritme voor herhaling op maat
│
├── components/
│   ├── layout/
│   │   ├── Dashboard.tsx     # Hoofdmenu met module- en oefenvormkeuze
│   │   └── Navigation.tsx    # Navigatiebalk
│   ├── exercises/
│   │   ├── MultipleChoice.tsx   # Meerkeuzevragen
│   │   ├── FillInBlank.tsx      # Invuloefeningen
│   │   ├── Flashcards.tsx       # Flashcards met flip-animatie
│   │   └── MapInteractive.tsx   # Kaartoefeningen via Leaflet + GeoJSON
│   └── admin/
│       └── DataValidator.tsx    # Debug-paneel (/debug-data)
│
├── pages/
│   ├── Home.tsx
│   ├── Practice.tsx
│   └── Stats.tsx
│
└── App.tsx
```

---

## Datasets

### `belgium.json`
| Sleutel | Inhoud | Aantal |
|---|---|---|
| `provinces` | 10 provincies + hoofdsteden + gewest | 10 |
| `regions` | Vlaamse, Waalse en Brusselse gewest | 3 |
| `ports` | Antwerpen, Zeebrugge, Gent | 3 |
| `rivers` | IJzer, Schelde, Maas, Leie, Samber | 5 |
| `highways` | E40, E403, E17, E19, E411, E42, E313, E314 | 8 |
| `highestPoint` | Signal de Botrange | 1 |

### `europe.json`
| Sleutel | Inhoud | Aantal |
|---|---|---|
| `countries` | Alle 41 Europese landen + hoofdsteden | 41 |
| `islandsAndPeninsulas` | Schiereilanden en eilanden | 10 |
| `seas` | Zeeën en zee-engtes | 15 |
| `rivers` | Rijn, Wolga, Donau … | 17 |
| `mountains` | Pyreneeën, Alpen, Kaukasus … | 6 |

### `world.json`
| Sleutel | Inhoud | Aantal |
|---|---|---|
| `countries` | Landen verspreid over alle continenten | 45 |
| `cities` | Wereldsteden met landkoppeling | 36 |
| `oceans` | Grote, Atlantische, Indische, Noordelijke IJszee | 4 |
| `latitudeCircles` | Evenaar, Kreeftskeerkring … | 5 |
| `longitudeLines` | Nulmeridiaan | 1 |
| `continents` | Eurazië, Afrika … | 6 |
| `worldParts` | Azië, Europa, Amerika … | 6 |
| `rivers` | Nijl, Amazone, Mississippi … | 13 |
| `mountains` | Himalaya, Andes, Atlas … | 13 |

---

## Oefenvormen

### Invuloefeningen
De app vraagt een naam, en de leerling typt het antwoord. Het systeem vergelijkt **na normalisatie**: accenten, hoofdletters en spaties worden genegeerd. "Belgie", "belgië" en "België" zijn dus allemaal correct.

Alternatieve namen (zoals "Blauwe rivier" voor de Jangtsekiang) zijn ook geregistreerd als geldig antwoord.

### Meerkeuzevragen
Vier opties, waarvan één correct. De drie foute opties komen altijd uit **dezelfde categorie in de dataset** — nooit verzonnen, nooit van buiten de databank. Zo:

```
Wat is de hoofdstad van Hongarije?
  ○ Warschau
  ○ Praag
  ● Boedapest   ✓
  ○ Bratislava
```

### Flashcards
Voorkant toont een land (of rivier, of gebergte). Klikken draait de kaart om met een 3D-animatie en toont het antwoord. Navigeer met de pijlknoppen.

### Interactieve kaart
Een kaartvraag geeft een naam ("Klik op België") en kleurt een correct aangeklikt land groen, een fout aangeklikt land rood. Validatie gebeurt via het GeoJSON-object-id — nooit een bounding box of schatting.

### Spaced Repetition
Het algoritme houdt bij hoeveel keer je een vraag correct hebt beantwoord en plant de volgende herhaling op basis van dit schema:

| Opeenvolgende correcte antwoorden | Volgende herhaling |
|---|---|
| 0 | Onmiddellijk |
| 1 | Na 1 dag |
| 2 | Na 3 dagen |
| 3 | Na 7 dagen |
| 4 | Na 14 dagen |
| 5+ | Na 30 dagen |

---

## Installatie & starten

### Vereisten
- Node.js ≥ 18
- npm ≥ 9

### Lokaal draaien
```bash
git clone https://github.com/tijldebreuck-collab/Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck.git
cd Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck

npm install
npm run dev
```

Open daarna [http://localhost:5173](http://localhost:5173) in je browser.

### Bouwen voor productie
```bash
npm run build
npm run preview
```

### Datavalidatie draaien
```bash
node validate-data.js
```

Dit script controleert alle drie de datasets op duplicaten, lege velden, onjuiste koppelingen en verwachte aantallen. Fouten worden in de console getoond en het script sluit af met exitcode 1 als er kritieke fouten zijn.

---

## Online gebruiken (Chromebook)

De app is ontworpen om probleemloos te werken via **StackBlitz** of **CodeSandbox** — geen installatie nodig.

1. Ga naar [stackblitz.com](https://stackblitz.com) en kies **React + TypeScript**
2. Sleep of importeer de bestanden uit deze repo in de editor
3. StackBlitz start de Vite-dev-server automatisch in de browser
4. Je krijgt een deelbare URL (bijv. `jouw-project.stackblitz.io`)

Je kunt ook rechtstreeks importeren via:
```
https://stackblitz.com/github/tijldebreuck-collab/Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck
```

---

## Datavalidatie

De applicatie bevat een ingebouwde validatielaag. Bij het opstarten (en op aanvraag via het debugpaneel) worden de volgende controles uitgevoerd:

- Geen dubbele IDs binnen een dataset
- Geen dubbele namen of hoofdsteden
- Elk object heeft alle verplichte velden
- Elke `countryId` in steden verwijst naar een bestaand land
- Elke `region` in Belgische provincies verwijst naar een bestaand gewest
- Exacte aantallen overeenkomen met de bronleerstof (bv. precies 41 Europese landen)

**Debugpaneel:** navigeer naar `/debug-data` voor een volledig overzicht van alle datasets, records en eventuele inconsistenties.

**Knop "Controleer databank":** voert alle controles uit en toont een rapport rechtstreeks in de UI.

---

## Regels & architectuurprincipes

Deze regels zijn bindend voor de volledige codebase:

> **De app mag NOOIT:**
> - zelf landen, steden, rivieren of locaties verzinnen
> - hardcoded geografische kennis bevatten buiten de JSON-datasets
> - meerkeuze-antwoorden genereren van buiten de databank
> - GeoJSON-locaties schatten of benaderen — enkel exacte object-IDs zijn geldig

> **Correctheid heeft altijd voorrang op uiterlijk.**

Elke oefening moet voor 100% overeenkomen met de databank. Nieuwe functies worden alleen toegevoegd nadat de bestaande functionaliteit correct en gevalideerd is.

---

## Uitbreiden

Nieuwe leerstof toevoegen vereist geen codewijzigingen. Voeg gewoon een nieuw object toe aan het juiste JSON-bestand:

```json
// Nieuw land toevoegen aan europe.json:
{ "id": "eu-xyz", "name": "Nieuw Land", "capital": "Nieuwe Stad" }
```

```json
// Nieuwe rivier toevoegen aan world.json:
{ "id": "wd-riv-xyz", "name": "Nieuwe Rivier" }
```

Alle oefenvormen (meerkeuze, invullen, flashcards) laden de data automatisch bij de volgende start.

Draai daarna altijd:
```bash
node validate-data.js
```
om te bevestigen dat de dataset nog klopt.

---

## Licentie

Persoonlijk schoolproject — niet voor commercieel gebruik.  
Gemaakt door **Tijl De Breuck**, 4e jaar secundair onderwijs, België.

# English
# 🌍 Geography Ready Knowledge Trainer

> An interactive, database-driven practice app for geography in the 4th year of secondary school — based on the official Belgian curriculum.

---

## Contents

- [About the project](#about-the-project)
- [Features](#features)
- [Technologies](#technologies)
- [Project structure](#project-structure)
- [Datasets](#datasets)
- [Exercise modes](#exercise-modes)
- [Installation & setup](#installation--setup)
- [Using online (Chromebook)](#using-online-chromebook)
- [Data validation](#data-validation)
- [Rules & architecture principles](#rules--architecture-principles)
- [Extending the app](#extending-the-app)
- [License](#license)

---

## About the project

This application was built as a personal study tool for Geography in the 4th year of secondary school (Belgian curriculum). It lets you practise **ready knowledge** — meaning: knowing geographic names and locations without consulting an atlas.

The app is driven by **three JSON datasets** that serve as the single source of truth. All questions, answers, multiple-choice options, and map validations come exclusively from those files. Geographic knowledge is never invented or guessed.

**Modules:**
- 🇧🇪 **Belgium** — provinces, capitals, regions, ports, rivers, motorways
- 🌍 **Europe** — 41 countries + capitals, seas, rivers, mountain ranges, islands
- 🗺️ **World** — continents, oceans, 45 countries, 36 cities, rivers, mountain ranges

---

## Features

| Category | What you can practise |
|---|---|
| **Fill-in exercises** | Type the name of a country, capital, river, or province |
| **Multiple choice** | 4 options, all answers drawn from the dataset |
| **Flashcards** | Front/back with a 3D flip animation |
| **Interactive map** | Click on the requested country or province |
| **Time challenge** | 30s / 60s / 2min / unlimited |
| **Spaced repetition** | Incorrectly answered questions appear more often |
| **Progress tracking** | Saved locally via `localStorage` |
| **Dark mode** | Automatic and manually toggleable |
| **Data validation report** | Built-in check system on startup |

---

## Technologies

- **React 19** + **TypeScript** (strict mode)
- **Vite** — fast builds, ideal for StackBlitz/CodeSandbox
- **Tailwind CSS 4** — utility-first styling with glassmorphism effects
- **Framer Motion** — animations (flashcard flip, feedback, confetti)
- **React-Leaflet** — interactive maps with GeoJSON
- **LocalStorage** — progress and scores stored locally
- **JSON** — single source of truth for all exercises

---

## Project structure

```
src/
├── data/
│   ├── belgium.json          # 🇧🇪 Provinces, rivers, ports, motorways
│   ├── europe.json           # 🌍 41 countries, seas, mountains, islands
│   └── world.json            # 🗺️ 45 countries, 36 cities, oceans, rivers
│
├── types/
│   └── geography.ts          # TypeScript interfaces for all data types
│
├── utils/
│   ├── textUtils.ts          # Normalisation (accents, capitalisation, spaces)
│   └── validation.ts         # Dataset audit function
│
├── hooks/
│   ├── useQuestionGenerator.ts  # Central quiz engine (ONLY source of questions)
│   └── useSpacedRepetition.ts   # SRS algorithm for personalised repetition
│
├── components/
│   ├── layout/
│   │   ├── Dashboard.tsx     # Main menu with module and exercise mode selection
│   │   └── Navigation.tsx    # Navigation bar
│   ├── exercises/
│   │   ├── MultipleChoice.tsx   # Multiple-choice questions
│   │   ├── FillInBlank.tsx      # Fill-in exercises
│   │   ├── Flashcards.tsx       # Flashcards with flip animation
│   │   └── MapInteractive.tsx   # Map exercises via Leaflet + GeoJSON
│   └── admin/
│       └── DataValidator.tsx    # Debug panel (/debug-data)
│
├── pages/
│   ├── Home.tsx
│   ├── Practice.tsx
│   └── Stats.tsx
│
└── App.tsx
```

---

## Datasets

### `belgium.json`
| Key | Contents | Count |
|---|---|---|
| `provinces` | 10 provinces + capitals + region | 10 |
| `regions` | Flemish, Walloon and Brussels Capital Region | 3 |
| `ports` | Antwerp, Zeebrugge, Ghent | 3 |
| `rivers` | Yser, Scheldt, Meuse, Lys, Sambre | 5 |
| `highways` | E40, E403, E17, E19, E411, E42, E313, E314 | 8 |
| `highestPoint` | Signal de Botrange | 1 |

### `europe.json`
| Key | Contents | Count |
|---|---|---|
| `countries` | All 41 European countries + capitals | 41 |
| `islandsAndPeninsulas` | Peninsulas and islands | 10 |
| `seas` | Seas and straits | 15 |
| `rivers` | Rhine, Volga, Danube … | 17 |
| `mountains` | Pyrenees, Alps, Caucasus … | 6 |

### `world.json`
| Key | Contents | Count |
|---|---|---|
| `countries` | Countries across all continents | 45 |
| `cities` | World cities linked to a country | 36 |
| `oceans` | Pacific, Atlantic, Indian, Arctic | 4 |
| `latitudeCircles` | Equator, Tropic of Cancer … | 5 |
| `longitudeLines` | Prime Meridian | 1 |
| `continents` | Eurasia, Africa … | 6 |
| `worldParts` | Asia, Europe, Americas … | 6 |
| `rivers` | Nile, Amazon, Mississippi … | 13 |
| `mountains` | Himalayas, Andes, Atlas … | 13 |

---

## Exercise modes

### Fill-in exercises
The app prompts a name, and the student types the answer. The system compares answers **after normalisation**: accents, capitalisation, and spaces are ignored. "Belgie", "belgië" and "België" are all accepted as correct.

Alternative names (such as "Yellow River" for the Huang He) are also registered as valid answers.

### Multiple choice
Four options, one of which is correct. The three wrong options always come from **the same category in the dataset** — never invented, never from outside the database. For example:

```
What is the capital of Hungary?
  ○ Warsaw
  ○ Prague
  ● Budapest   ✓
  ○ Bratislava
```

### Flashcards
The front shows a country (or river, or mountain range). Clicking flips the card with a 3D animation and reveals the answer. Navigate with the arrow buttons.

### Interactive map
A map question gives a name ("Click on Belgium") and colours a correctly clicked country green, an incorrectly clicked country red. Validation is done via the GeoJSON object ID — never a bounding box or estimated location.

### Spaced repetition
The algorithm tracks how many times you have answered a question correctly and schedules the next review according to this table:

| Consecutive correct answers | Next review |
|---|---|
| 0 | Immediately |
| 1 | After 1 day |
| 2 | After 3 days |
| 3 | After 7 days |
| 4 | After 14 days |
| 5+ | After 30 days |

---

## Installation & setup

### Requirements
- Node.js ≥ 18
- npm ≥ 9

### Running locally
```bash
git clone https://github.com/tijldebreuck-collab/Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck.git
cd Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck

npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production
```bash
npm run build
npm run preview
```

### Running data validation
```bash
node validate-data.js
```

This script checks all three datasets for duplicates, empty fields, broken references, and expected counts. Errors are shown in the console and the script exits with code 1 if critical errors are found.

---

## Using online (Chromebook)

The app is designed to run without issues via **StackBlitz** or **CodeSandbox** — no installation required.

1. Go to [stackblitz.com](https://stackblitz.com) and choose **React + TypeScript**
2. Drag or import the files from this repo into the editor
3. StackBlitz automatically starts the Vite dev server in the browser
4. You get a shareable URL (e.g. `your-project.stackblitz.io`)

You can also import directly via:
```
https://stackblitz.com/github/tijldebreuck-collab/Aardrijkskunde-gepersonaliseerde-paratkennistrainer-Tijl-Debreuck
```

---

## Data validation

The application includes a built-in validation layer. On startup (and on demand via the debug panel) the following checks are performed:

- No duplicate IDs within a dataset
- No duplicate names or capitals
- Every object has all required fields
- Every `countryId` in cities refers to an existing country
- Every `region` in Belgian provinces refers to an existing region
- Exact counts match the source curriculum (e.g. exactly 41 European countries)

**Debug panel:** navigate to `/debug-data` for a full overview of all datasets, record counts, and any inconsistencies.

**"Check database" button:** runs all checks and displays a report directly in the UI.

---

## Rules & architecture principles

These rules are binding for the entire codebase:

> **The app must NEVER:**
> - invent countries, cities, rivers, or locations on its own
> - contain hardcoded geographic knowledge outside the JSON datasets
> - generate multiple-choice answers from outside the database
> - estimate or approximate GeoJSON locations — only exact object IDs are valid

> **Correctness always takes priority over appearance.**

Every exercise must match the database 100%. New features are only added after existing functionality is correct and validated.

---

## Extending the app

Adding new content requires no code changes. Simply add a new object to the appropriate JSON file:

```json
// Adding a new country to europe.json:
{ "id": "eu-xyz", "name": "New Country", "capital": "New City" }
```

```json
// Adding a new river to world.json:
{ "id": "wd-riv-xyz", "name": "New River" }
```

All exercise modes (multiple choice, fill-in, flashcards) load the data automatically on the next start.

Always run afterwards:
```bash
node validate-data.js
```
to confirm the dataset is still consistent.

---

## License

Personal school project — not for commercial use.  
Made by **Tijl De Breuck**, 4th year of secondary school, Belgium.
