# GeoTrainer
- 🇳🇱 [Nederlandse versie](#nederlands)
- 🇬🇧 [English version](#english)

## Nederlands:
# 🌍 Aardrijkskunde Parate Kennis Trainer

> Een interactieve, databankgestuurde oefenapp voor aardrijkskunde in het 4e jaar secundair onderwijs — gebaseerd op de officiële Belgische cursusleerstof.

---

## Inhoud

- [Over het project](#over-het-project)
- [Functies](#functies)
- [Technologieën](#technologieën)
- [Projectstructuur](#projectstructuur)
- [Datasets](#datasets)
- [Oefenvormen](#oefenvormen)
- [Authenticatie & cloud-opslag](#authenticatie--cloud-opslag)
- [Instellingen](#instellingen)
- [Installatie & starten](#installatie--starten)
- [Datavalidatie](#datavalidatie)
- [Architectuurprincipes](#architectuurprincipes)
- [Uitbreiden](#uitbreiden)
- [Ontwikkeltools](#ontwikkeltools)
- [Licentie](#licentie)

---

## Over het project

Deze applicatie is gebouwd als persoonlijk studiehulpmiddel voor het vak Aardrijkskunde in het 4e jaar secundair onderwijs (Belgisch leerplan). Ze laat je **parate kennis** oefenen — geografische namen en locaties kennen zonder je atlas te raadplegen.

De app draait op **drie JSON-datasets** als enige bron van waarheid. Alle vragen, antwoorden, meerkeuzeopties en kaartvalidaties komen uitsluitend uit die bestanden. Er wordt nooit geografische kennis verzonnen of geraden.

**Modules:**
- **België** — 10 provincies, hoofdsteden, gewesten, buurlanden, havens, rivieren, autosnelwegen
- **Europa** — 41 landen + hoofdsteden, zeeën, rivieren, gebergten, eilanden en schiereilanden
- **Wereld** — continenten, oceanen, 174 landen, 36 steden, rivieren, gebergten, referentielijnen

---

## Functies

| Categorie | Functie |
|---|---|
| **Oefenvormen** | Meerkeuze, invullen, vlaggenquiz, kaartoefeningen, fouten herzien |
| **Interactieve kaarten** | SVG/D3-kaarten voor België, Europa en de wereld — klikken per regio |
| **Vlaggen** | 85 lansvlaggen (SVG) gekoppeld aan dataset-IDs |
| **Eigen oefensets** | Maak aangepaste mappen met items uit alle modules |
| **Statistieken** | Precisie, totaal beantwoord, gemiddelde tijd, zwakste punten |
| **Geluid** | Web Audio API synthesizer voor feedback-geluiden, uitschakelbaar |
| **Dark / light mode** | Schakelbaar, opgeslagen in localStorage |
| **Taalinstelling** | Nederlands en Engels (UI + geografische namen) |
| **Admin-paneel** | Wachtwoordbeveiligd, voor databankbeheer en audit |
| **Datavalidatie** | Ingebouwde audit bij het opstarten en via `/debug-data` |
| **Export / import** | Voortgang en instellingen exporteren en importeren als JSON |

---

## Technologieën

- **React 19** + **TypeScript 5** (strict mode)
- **Vite 6** — modulebundler en dev-server
- **Tailwind CSS 4** — utility-first styling, dark mode, glassmorphism
- **Motion (Framer Motion 12)** — animaties, flashcard-flip, feedback
- **D3.js + TopoJSON** — SVG-kaartrendering voor de drie modules
- **Express + TSX** — Node.js-server voor de backend API en statische bestanden
- **Firebase 12** — authenticatie (Google OAuth + e-mail/wachtwoord) en Firestore voor cloudopslag van voortgang
- **canvas-confetti** — animatie bij perfecte scores
- **Lucide React** — iconen
- **Helmet + rate-limiter** — beveiliging van de API-server
- **Web Audio API** — ingebouwde synthesizer voor geluidseffecten (geen externe bestanden nodig)

---

## Projectstructuur

```
├── src/
│   ├── App.tsx                    # Hoofdcomponent: routing, state, timer, thema, taal
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   │
│   ├── data/
│   │   ├── belgium.json           # 🇧🇪 Provincies, rivieren, havens, autosnelwegen, buurlanden
│   │   ├── belgium-provinces.json # GeoJSON-polygonen voor de Belgische kaart
│   │   ├── europe.json            # 41 landen, zeeën, gebergten, eilanden
│   │   ├── world.json             # 174 landen, 36 steden, oceanen, rivieren, gebergten
│   │   └── geoData.ts             # Geherexporteerde lijsten voor rivieren, gebergten, autosnelwegen
│   │
│   ├── types/
│   │   └── geography.ts           # GeoItem, Question, Dataset, Region, QuizMode, QuestionType …
│   │
│   ├── hooks/
│   │   ├── useQuizEngine.ts       # Centrale quiz-engine: pool, SRS, scoring, history
│   │   └── useUserPreferences.ts  # Firebase-synchronisatie van voorkeuren en eigen mappen
│   │
│   ├── utils/
│   │   ├── normalization.ts       # normalize() + validateAnswer() — accenttolerantie
│   │   ├── flags.ts               # ISO-code-mapping van dataset-IDs naar vlagafbeeldingen
│   │   ├── language.ts            # nl/en-vertalingen voor UI én geografische namen
│   │   ├── achievements.ts        # Definitie van alle 45+ achievements
│   │   ├── audio.ts               # Web Audio API synthesizer (correct / fout / confetti)
│   │   ├── questionDescriptions.ts# Vraagtekstgenerator per categorie en taal
│   │   └── validation.ts          # Dataset-audit: duplicaten, lege velden, aantallen
│   │
│   ├── lib/
│   │   └── firebase.ts            # Firebase-initialisatie (Auth + Firestore + Analytics)
│   │
│   └── components/
│       ├── BelgiumMap.tsx         # D3 SVG-kaart van België (provincies)
│       ├── EuropeMap.tsx          # D3 SVG-kaart van Europa (landen)
│       ├── WorldMap.tsx           # D3 TopoJSON-kaart van de wereld
│       ├── GeoQuiz.tsx            # Hoofdscherm voor een actieve quizsessie
│       │
│       ├── exercises/
│       │   ├── MultipleChoice.tsx # Meerkeuzevragen met animaties
│       │   ├── FillInBlank.tsx    # Invuloefeningen met accenttolerantie
│       │   ├── FlagQuiz.tsx       # Vlaggenquiz met SVG-vlaggen
│       │   └── MapQuizPlayer.tsx  # Kaartvalidatie-wrapper voor alle drie modules
│       │
│       ├── layout/
│       │   ├── LoginMenu.tsx      # Firebase-loginscherm (Google + e-mail)
│       │   ├── MyLearningContent.tsx # Eigen oefensets en mapbeheer
│       │   ├── Stats.tsx          # Statistieken-dashboard (precisie, tijd, zwakste punten)
│       │   └── Settings.tsx       # Thema, taal, geluid, export/import, admin-toegang
│       │
│       └── admin/
│           ├── DataValidator.tsx  # Debug-paneel: databankaudit in de UI
│           └── DatasetAdmin.tsx   # Dataset-beheer: items toevoegen en verwijderen
│
├── public/
│   └── flags/                     # 85 SVG-vlagbestanden (ISO 3166-1 alpha-2 namen)
│
├── api/
│   └── admin/
│       └── verify.js              # POST-endpoint voor admin-wachtwoordverificatie
│
├── server.ts                      # Express-server met Vite SSR, Helmet, rate limiting
├── firestore.rules                # Firestore-beveiligingsregels (alleen eigen data)
├── vite.config.ts
├── tsconfig.json
├── package.json
├── validate-data.js               # Standalone databankvalidatiescript (Node.js)
├── world-atlas-countries.json     # TopoJSON voor de wereldkaart
├── bel_provinces_ne.json          # GeoJSON voor de Belgische provinciekaart
│
└── *.py                           # ~51 Python-hulpscripts gebruikt tijdens de bouw
                                   # (datamigratie, kaartfixes, stijlupdates — geen runtime)
```

---

## Datasets

### `belgium.json`

| Sleutel | Inhoud | Aantal |
|---|---|---|
| `provinces` | Provincies met hoofdstad, gewest, coördinaten en polygoon | 10 |
| `regions` | Vlaamse, Waalse en Brussels Hoofdstedelijk Gewest | 3 |
| `ports` | Antwerpen, Zeebrugge, Gent | 3 |
| `rivers` | IJzer, Schelde, Maas (hoofdrivieren) + Leie, Samber (zijrivieren) | 5 |
| `highways` | E40, E403, E17, E19, E411, E42, E313, E314 | 8 |
| `neighbors` | Omliggende landen (met grenspolygonen voor de kaart) | 4 |

Elk item bevat een `polygon`-array voor kaartklikvalidatie en optionele `alternatives` voor antwoordtolerantie.

### `europe.json`

| Sleutel | Inhoud | Aantal |
|---|---|---|
| `countries` | 41 landen + hoofdsteden, coördinaten, polygonen en alternatieven | 41 |
| `seas` | Zeeën en zee-engtes | 15 |
| `rivers` | Rijn, Wolga, Donau … | 17 |
| `mountains` | Pyreneeën, Alpen, Kaukasus … | 6 |
| `islands_peninsulas` | Eilanden en schiereilanden | 11 |

### `world.json`

| Sleutel | Inhoud | Aantal |
|---|---|---|
| `countries` | Landen wereldwijd met coördinaten en hoofdsteden | **174** |
| `steden` | Wereldsteden met coördinaten en alternatieven | 36 |
| `seas` | Oceanen en grote zeeën | 9 |
| `rivers` | Wereldrivieren | 13 |
| `mountains` | Wereldgebergten en -plateaus | 13 |
| `continents` | Continenten met polygonen | 6 |
| `werelddelen` | Werelddelen | 6 |
| `referenceLines` | Nulmeridiaan, Evenaar, Kreeftskeerkring … | 6 |
| `oceans` | Grote oceanen (als aparte categorie) | 4 |

> De wereldmodule bevat **174 landen** — aanzienlijk meer dan de 45 die de cursus vereist. De extra landen zijn beschikbaar voor uitgebreide oefensessies en worden ook gebruikt als foute antwoordopties bij meerkeuzevragen.

---

## Oefenvormen

### Meerkeuze
Vier opties, waarvan één correct. Foute opties komen altijd uit dezelfde categorie in de dataset. Nooit verzonnen, nooit van buiten de databank.

```
Wat is de hoofdstad van Hongarije?
  ○ Warschau
  ○ Praag
  ● Boedapest   ✓
  ○ Bratislava
```

### Invullen
De leerling typt het antwoord. Vergelijking gebeurt na **normalisatie**: accenten, hoofdletters, spaties en leestekens worden genegeerd. "Belgie", "belgië" en "België" zijn allemaal correct. Alternatieve namen (bv. "Stille Oceaan" voor de Grote Oceaan) worden ook geaccepteerd.

### Vlaggenquiz
Toont de vlag van een land en vraagt de naam. Werkt voor alle 41 Europese landen en de meeste wereldlanden (85 SVG-vlaggen beschikbaar). Fallback naar een placeholder bij ontbrekende vlaggen.

### Kaartoefeningen
D3-SVG-kaarten voor België (provincies), Europa (landen) en de wereld (landen via TopoJSON). Een klik op het juiste object geeft groene feedback, een foutieve klik rode feedback. Validatie is strikt op object-ID — geen bounding boxes, geen schattingen.

### Fouten herzien
Na een sessie kan de leerling alle foutieve vragen opnieuw overlopen in een aparte oefenronde.

### Eigen oefensets
Maak aangepaste mappen met specifieke items uit om het even welke module of categorie. Sla ze op via Firebase (ingelogd) of lokaal (gast).

## Authenticatie & cloud-opslag

De app ondersteunt twee gebruikersmodi:

**Gast (geen account)**
- Voortgang en instellingen worden opgeslagen in `localStorage`
- Eigen oefensets en statistieken zijn beschikbaar per toestel

**Ingelogde gebruiker (Firebase)**
- Aanmelden via Google OAuth of e-mail + wachtwoord
- Voortgang, statistieken en eigen oefensets worden gesynchroniseerd via Firestore
- Beveiligd via Firestore-regels: elke gebruiker heeft enkel toegang tot zijn eigen data

**Beveiliging**
- Firestore-regels vereisen authenticatie en eigenaarschap voor alle lees- en schrijfoperaties
- De Express-server gebruikt Helmet voor HTTP-headers en rate limiting (100 verzoeken per 15 min, 5 inlogpogingen per uur)
- Een apart admin-wachtwoord geeft toegang tot het beheerpaneel

---

## Instellingen

Toegankelijk via het tandwielpictogram:

| Instelling | Opties |
|---|---|
| **Thema** | Dark / light, opgeslagen in localStorage |
| **Taal** | Nederlands / Engels (UI én geografische namen) |
| **Geluid** | Aan / uit, opgeslagen in localStorage |
| **Statistieken wissen** | Reset alle lokale voortgangsdata |
| **Export** | Download voortgang als JSON-bestand |
| **Import** | Laad eerder geëxporteerde voortgang terug in |
| **Admin-toegang** | Wachtwoordbeveiligd paneel voor databankbeheer |

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

### Omgevingsvariabelen

Maak een `.env`-bestand aan in de root:

```env
ADMIN_PASSWORD=jouw_admin_wachtwoord
```

Firebase-configuratie zit in `firebase-applet-config.json` (niet mee gecommit — voeg je eigen configuratie toe vanuit de Firebase Console).

### Bouwen voor productie

```bash
npm run build
npm start
```

### Databankvalidatie draaien

```bash
node validate-data.js
```

Controleert alle drie datasets op duplicaten, lege velden, onjuiste koppelingen en verwachte aantallen. Sluit af met exitcode 1 bij kritieke fouten.

---

## Datavalidatie

De applicatie bevat een ingebouwde validatielaag die bij het opstarten de volgende controles uitvoert:

- Geen dubbele IDs binnen een dataset
- Geen dubbele namen of hoofdsteden
- Elk object heeft alle verplichte velden
- Elke `countryId` in steden verwijst naar een bestaand land
- Elke vlag-ISO-code verwijst naar een bestaand SVG-bestand

**Debugpaneel:** navigeer naar `/debug-data` voor een volledig overzicht van alle datasets, record-aantallen en eventuele inconsistenties.

**Knop "Controleer databank":** beschikbaar in het admin-paneel — voert de audit uit en toont een rapport in de UI.

---

## Architectuurprincipes

Deze regels zijn bindend voor de volledige codebase:

> **De app mag NOOIT:**
> - zelf landen, steden, rivieren of locaties verzinnen
> - hardcoded geografische kennis bevatten buiten de JSON-datasets
> - meerkeuze-antwoorden genereren van buiten de databank
> - GeoJSON-locaties schatten of benaderen — enkel exacte object-IDs zijn geldig

> **Correctheid heeft altijd voorrang op uiterlijk.**

Elke oefening moet 100% overeenkomen met de databank. Nieuwe functies worden alleen toegevoegd nadat de bestaande functionaliteit correct en gevalideerd is.

---

## Uitbreiden

### Nieuw land of stad toevoegen

Voeg een nieuw object toe aan het juiste JSON-bestand. Geen codewijzigingen nodig.

```json
// Nieuw land in world.json → countries:
{
  "id": "wd-l-xyz",
  "name": "Nieuw Land",
  "category": "country",
  "coordinates": [10.0, 20.0],
  "capital": "Nieuwe Hoofdstad"
}
```

```json
// Nieuwe stad in world.json → steden:
{
  "id": "wd-s-xyz",
  "name": "Nieuwe Stad",
  "category": "city",
  "coordinates": [10.0, 20.0],
  "alternatives": ["Alt. Naam"]
}
```

### Nieuwe categorie toevoegen

1. Voeg de categorie toe aan `QuestionType` in `src/types/geography.ts`
2. Voeg de data-array toe aan het juiste JSON-bestand
3. Registreer de categorie in `useQuizEngine.ts` (datapool-selectie)
4. Voeg een vraagtekst toe in `src/utils/questionDescriptions.ts`

### Vlag toevoegen

Zet een `xx.svg`-bestand in `public/flags/` en voeg de ID-mapping toe aan `src/utils/flags.ts`.

### Draai altijd na aanpassingen

```bash
node validate-data.js
```

---

## Ontwikkeltools

De repo bevat ~51 Python-scripts die tijdens de bouw zijn gebruikt voor datamigratie, kaartfixes en stijlupdates. Ze zijn geen onderdeel van de productieapp maar staan in de root als referentie:

| Script(s) | Doel |
|---|---|
| `add_all_countries.py`, `add_capitals.py` | Landen en hoofdsteden toevoegen aan datasets |
| `add_difficulty.py` | Moeilijkheidsgraad toewijzen aan items |
| `fix_*.py` | Bugs in componenten, kaarten en importpaden herstellen |
| `update_*.py` | Kaartcomponenten en quizlogica bijwerken |
| `get_bel_provinces.py`, `match_countries.py` | GeoJSON-brondata verwerken |
| `strip_ai.py`, `strip_server.py` | AI-gegenereerde boilerplate verwijderen |
| `run_audit.ts` | Standalone audit-script (TypeScript) |

---

## Licentie

Persoonlijk schoolproject — niet voor commercieel gebruik.  
Gemaakt door **Tijl De Breuck**, 4e jaar secundair onderwijs, België.



## English
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
- [Authentication & cloud storage](#authentication--cloud-storage)
- [Settings](#settings)
- [Achievements](#achievements)
- [Installation & setup](#installation--setup)
- [Data validation](#data-validation)
- [Architecture principles](#architecture-principles)
- [Extending the app](#extending-the-app)
- [Development tools](#development-tools)
- [License](#license)

---

## About the project

This application was built as a personal study tool for Geography in the 4th year of secondary school (Belgian curriculum). It lets you practise **ready knowledge** — knowing geographic names and locations without consulting an atlas.

The app runs on **three JSON datasets** as the single source of truth. All questions, answers, multiple-choice options, and map validations come exclusively from those files. Geographic knowledge is never invented or guessed.

**Modules:**
- **Belgium** — 10 provinces, capitals, regions, neighbouring countries, ports, rivers, motorways
- **Europe** — 41 countries + capitals, seas, rivers, mountain ranges, islands and peninsulas
- **World** — continents, oceans, 174 countries, 36 cities, rivers, mountain ranges, reference lines

---

## Features

| Category | Feature |
|---|---|
| **Exercise modes** | Multiple choice, fill-in, flag quiz, map exercises, review errors |
| **Interactive maps** | SVG/D3 maps for Belgium, Europe, and the world — clickable per region |
| **Flags** | 85 country flags (SVG) linked to dataset IDs |
| **Custom study sets** | Create personalised folders with items from any module |
| **Statistics** | Accuracy, total answered, average time, weakest points |
| **Achievements** | 45+ achievements across 5 categories |
| **Sound** | Web Audio API synthesizer for feedback sounds, toggleable |
| **Dark / light mode** | Switchable, saved in localStorage |
| **Language setting** | Dutch and English (UI + geographic names) |
| **Admin panel** | Password-protected, for database management and audit |
| **Data validation** | Built-in audit on startup and via `/debug-data` |
| **Export / import** | Export and import progress and settings as JSON |

---

## Technologies

- **React 19** + **TypeScript 5** (strict mode)
- **Vite 6** — module bundler and dev server
- **Tailwind CSS 4** — utility-first styling, dark mode, glassmorphism
- **Motion (Framer Motion 12)** — animations, flashcard flip, feedback
- **D3.js + TopoJSON** — SVG map rendering for all three modules
- **Express + TSX** — Node.js server for the backend API and static files
- **Firebase 12** — authentication (Google OAuth + email/password) and Firestore for cloud storage of progress
- **canvas-confetti** — animation on perfect scores
- **Lucide React** — icons
- **Helmet + rate-limiter** — API server security
- **Web Audio API** — built-in synthesizer for sound effects (no external audio files required)

---

## Project structure

```
├── src/
│   ├── App.tsx                    # Root component: routing, state, timer, theme, language
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   │
│   ├── data/
│   │   ├── belgium.json           # 🇧🇪 Provinces, rivers, ports, motorways, neighbours
│   │   ├── belgium-provinces.json # GeoJSON polygons for the Belgian map
│   │   ├── europe.json            # 41 countries, seas, mountains, islands
│   │   ├── world.json             # 174 countries, 36 cities, oceans, rivers, mountains
│   │   └── geoData.ts             # Re-exported lists for rivers, mountains, motorways
│   │
│   ├── types/
│   │   └── geography.ts           # GeoItem, Question, Dataset, Region, QuizMode, QuestionType …
│   │
│   ├── hooks/
│   │   ├── useQuizEngine.ts       # Central quiz engine: pool, SRS, scoring, history
│   │   └── useUserPreferences.ts  # Firebase sync of preferences and custom folders
│   │
│   ├── utils/
│   │   ├── normalization.ts       # normalize() + validateAnswer() — accent tolerance
│   │   ├── flags.ts               # ISO code mapping from dataset IDs to flag images
│   │   ├── language.ts            # nl/en translations for UI and geographic names
│   │   ├── achievements.ts        # Definitions for all 45+ achievements
│   │   ├── audio.ts               # Web Audio API synthesizer (correct / wrong / confetti)
│   │   ├── questionDescriptions.ts# Question text generator per category and language
│   │   └── validation.ts          # Dataset audit: duplicates, empty fields, counts
│   │
│   ├── lib/
│   │   └── firebase.ts            # Firebase initialisation (Auth + Firestore + Analytics)
│   │
│   └── components/
│       ├── BelgiumMap.tsx         # D3 SVG map of Belgium (provinces)
│       ├── EuropeMap.tsx          # D3 SVG map of Europe (countries)
│       ├── WorldMap.tsx           # D3 TopoJSON map of the world
│       ├── GeoQuiz.tsx            # Main screen for an active quiz session
│       │
│       ├── exercises/
│       │   ├── MultipleChoice.tsx # Multiple-choice questions with animations
│       │   ├── FillInBlank.tsx    # Fill-in exercises with accent tolerance
│       │   ├── FlagQuiz.tsx       # Flag quiz with SVG flags
│       │   └── MapQuizPlayer.tsx  # Map validation wrapper for all three modules
│       │
│       ├── layout/
│       │   ├── LoginMenu.tsx      # Firebase login screen (Google + email)
│       │   ├── MyLearningContent.tsx # Custom study sets and folder management
│       │   ├── Stats.tsx          # Statistics dashboard (accuracy, time, weaknesses)
│       │   └── Settings.tsx       # Theme, language, sound, export/import, admin access
│       │
│       └── admin/
│           ├── DataValidator.tsx  # Debug panel: database audit in the UI
│           └── DatasetAdmin.tsx   # Dataset management: add and remove items
│
├── public/
│   └── flags/                     # 85 SVG flag files (ISO 3166-1 alpha-2 names)
│
├── api/
│   └── admin/
│       └── verify.js              # POST endpoint for admin password verification
│
├── server.ts                      # Express server with Vite SSR, Helmet, rate limiting
├── firestore.rules                # Firestore security rules (own data only)
├── vite.config.ts
├── tsconfig.json
├── package.json
├── validate-data.js               # Standalone database validation script (Node.js)
├── world-atlas-countries.json     # TopoJSON for the world map
├── bel_provinces_ne.json          # GeoJSON for the Belgian province map
│
└── *.py                           # ~51 Python helper scripts used during development
                                   # (data migration, map fixes, style updates — not runtime)
```

---

## Datasets

### `belgium.json`

| Key | Contents | Count |
|---|---|---|
| `provinces` | Provinces with capital, region, coordinates, and polygon | 10 |
| `regions` | Flemish, Walloon, and Brussels Capital Region | 3 |
| `ports` | Antwerp, Zeebrugge, Ghent | 3 |
| `rivers` | Yser, Scheldt, Meuse (main rivers) + Lys, Sambre (tributaries) | 5 |
| `highways` | E40, E403, E17, E19, E411, E42, E313, E314 | 8 |
| `neighbors` | Neighbouring countries (with border polygons for the map) | 4 |

Each item contains a `polygon` array for map click validation and optional `alternatives` for answer tolerance.

### `europe.json`

| Key | Contents | Count |
|---|---|---|
| `countries` | 41 countries + capitals, coordinates, polygons, and alternatives | 41 |
| `seas` | Seas and straits | 15 |
| `rivers` | Rhine, Volga, Danube … | 17 |
| `mountains` | Pyrenees, Alps, Caucasus … | 6 |
| `islands_peninsulas` | Islands and peninsulas | 11 |

### `world.json`

| Key | Contents | Count |
|---|---|---|
| `countries` | Countries worldwide with coordinates and capitals | **174** |
| `steden` | World cities with coordinates and alternatives | 36 |
| `seas` | Oceans and major seas | 9 |
| `rivers` | World rivers | 13 |
| `mountains` | World mountain ranges and plateaus | 13 |
| `continents` | Continents with polygons | 6 |
| `werelddelen` | World regions | 6 |
| `referenceLines` | Prime Meridian, Equator, Tropic of Cancer … | 6 |
| `oceans` | Major oceans (as a separate category) | 4 |

> The world module contains **174 countries** — significantly more than the 45 required by the curriculum. The extra countries are available for extended practice sessions and are also used as wrong answer options in multiple-choice questions.

---

## Exercise modes

### Multiple choice
Four options, one of which is correct. Wrong options always come from the same category in the dataset. Never invented, never from outside the database.

```
What is the capital of Hungary?
  ○ Warsaw
  ○ Prague
  ● Budapest   ✓
  ○ Bratislava
```

### Fill-in
The student types the answer. Comparison happens after **normalisation**: accents, capitalisation, spaces, and punctuation are ignored. "Belgie", "belgië", and "België" are all accepted as correct. Alternative names (e.g. "Pacific Ocean" for the Great Ocean) are also accepted.

### Flag quiz
Shows a country's flag and asks for its name. Works for all 41 European countries and most world countries (85 SVG flags available). Falls back to a placeholder if a flag is missing.

### Map exercises
D3 SVG maps for Belgium (provinces), Europe (countries), and the world (countries via TopoJSON). Clicking the correct object gives green feedback; clicking the wrong one gives red feedback. Validation is strict on object ID — no bounding boxes, no estimates.

### Review errors
After a session, the student can go through all incorrectly answered questions again in a separate practice round.

### Custom study sets
Create personalised folders with specific items from any module or category. Saved via Firebase (when logged in) or locally (guest mode).

## Authentication & cloud storage

The app supports two user modes:

**Guest (no account)**
- Progress and settings are saved in `localStorage`
- Custom study sets and statistics are available per device

**Logged-in user (Firebase)**
- Sign in via Google OAuth or email + password
- Progress, statistics, and custom study sets are synchronised via Firestore
- Secured via Firestore rules: each user only has access to their own data

**Security**
- Firestore rules require authentication and ownership for all read and write operations
- The Express server uses Helmet for HTTP headers and rate limiting (100 requests per 15 min, 5 login attempts per hour)
- A separate admin password grants access to the management panel

---

## Settings

Accessible via the gear icon:

| Setting | Options |
|---|---|
| **Theme** | Dark / light, saved in localStorage |
| **Language** | Dutch / English (UI and geographic names) |
| **Sound** | On / off, saved in localStorage |
| **Difficulty** | All / easy / medium / hard |
| **Clear statistics** | Reset all local progress data |
| **Export** | Download progress as a JSON file |
| **Import** | Load previously exported progress |
| **Admin access** | Password-protected panel for database management |


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

### Environment variables

Create a `.env` file in the root:

```env
ADMIN_PASSWORD=your_admin_password
```

Firebase configuration lives in `firebase-applet-config.json` (not committed — add your own configuration from the Firebase Console).

### Building for production

```bash
npm run build
npm start
```

### Running database validation

```bash
node validate-data.js
```

Checks all three datasets for duplicates, empty fields, broken references, and expected counts. Exits with code 1 on critical errors.

---

## Data validation

The application includes a built-in validation layer that runs the following checks on startup:

- No duplicate IDs within a dataset
- No duplicate names or capitals
- Every object has all required fields
- Every `countryId` in cities refers to an existing country
- Every flag ISO code refers to an existing SVG file

**Debug panel:** navigate to `/debug-data` for a full overview of all datasets, record counts, and any inconsistencies.

**"Check database" button:** available in the admin panel — runs the audit and displays a report directly in the UI.

---

## Architecture principles

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

### Adding a new country or city

Add a new object to the appropriate JSON file. No code changes required.

```json
// New country in world.json → countries:
{
  "id": "wd-l-xyz",
  "name": "New Country",
  "category": "country",
  "coordinates": [10.0, 20.0],
  "capital": "New Capital"
}
```

```json
// New city in world.json → steden:
{
  "id": "wd-s-xyz",
  "name": "New City",
  "category": "city",
  "coordinates": [10.0, 20.0],
  "alternatives": ["Alt. Name"]
}
```

### Adding a new category

1. Add the category to `QuestionType` in `src/types/geography.ts`
2. Add the data array to the appropriate JSON file
3. Register the category in `useQuizEngine.ts` (data pool selection)
4. Add a question text in `src/utils/questionDescriptions.ts`

### Adding a flag

Place an `xx.svg` file in `public/flags/` and add the ID mapping to `src/utils/flags.ts`.

### Always run after changes

```bash
node validate-data.js
```

---

## Development tools

The repo contains ~51 Python scripts used during development for data migration, map fixes, and style updates. They are not part of the production app but are kept in the root for reference:

| Script(s) | Purpose |
|---|---|
| `add_all_countries.py`, `add_capitals.py` | Add countries and capitals to datasets |
| `add_difficulty.py` | Assign difficulty levels to items |
| `fix_*.py` | Fix bugs in components, maps, and import paths |
| `update_*.py` | Update map components and quiz logic |
| `get_bel_provinces.py`, `match_countries.py` | Process GeoJSON source data |
| `strip_ai.py`, `strip_server.py` | Remove AI-generated boilerplate |
| `run_audit.ts` | Standalone audit script (TypeScript) |

---

## License

Personal school project — not for commercial use.  
Made by **Tijl De Breuck**, 4th year of secondary school, Belgium.
