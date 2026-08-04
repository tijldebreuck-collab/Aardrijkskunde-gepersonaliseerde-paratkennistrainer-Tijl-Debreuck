import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import * as topojson from 'topojson-client';
import { worldCapitals, worldRivers, worldMountains, worldSeas, GeoFeature } from '../data/geoData';
import worldJSON from '../data/world.json';
import { Layers, Tag } from 'lucide-react';
import { translateName, Language } from '../utils/language';

interface WorldMapProps {
  activeQuestion?: {
    id: string;
    targetId: string;
    correctAnswer: string;
    geoItem?: any;
    category?: string;
  } | null;
  onResult?: (isCorrect: boolean, chosenVal: string, clickedId: string) => void;
  interactiveMode?: boolean; // If true, acts as a quiz. If false, acts as study reference.
  showCorrectAnswer?: boolean;
  wrongItems?: string[];
  language?: Language;
  allowedItemIds?: string[];
}

// Map numeric IDs from world-atlas to our world.json's IDs
const countryIdMap: Record<number, string> = {
  242: "wd-l-242", // Fiji
  834: "wd-l-834", // Tanzania
  732: "wd-l-732", // W. Sahara
  124: "wd-l-124", // Canada
  840: "wd-l-840", // United States of America
  398: "wd-l-398", // Kazakhstan
  860: "wd-l-860", // Uzbekistan
  598: "wd-l-598", // Papua New Guinea
  360: "wd-l-360", // Indonesia
  32: "wd-l-32", // Argentina
  152: "wd-l-152", // Chile
  180: "wd-l-180", // Dem. Rep. Congo
  706: "wd-l-706", // Somalia
  404: "wd-l-404", // Kenya
  729: "wd-l-729", // Sudan
  148: "wd-l-148", // Chad
  332: "wd-l-332", // Haiti
  214: "wd-l-214", // Dominican Rep.
  643: "wd-l-643", // Russia
  44: "wd-l-44", // Bahamas
  238: "wd-l-238", // Falkland Is.
  578: "wd-l-578", // Norway
  304: "wd-l-304", // Greenland
  260: "wd-l-260", // Fr. S. Antarctic Lands
  626: "wd-l-626", // Timor-Leste
  710: "wd-l-710", // South Africa
  426: "wd-l-426", // Lesotho
  484: "wd-l-484", // Mexico
  858: "wd-l-858", // Uruguay
  76: "wd-l-76", // Brazil
  68: "wd-l-68", // Bolivia
  604: "wd-l-604", // Peru
  170: "wd-l-170", // Colombia
  591: "wd-l-591", // Panama
  188: "wd-l-188", // Costa Rica
  558: "wd-l-558", // Nicaragua
  340: "wd-l-340", // Honduras
  222: "wd-l-222", // El Salvador
  320: "wd-l-320", // Guatemala
  84: "wd-l-84", // Belize
  862: "wd-l-862", // Venezuela
  328: "wd-l-328", // Guyana
  740: "wd-l-740", // Suriname
  250: "wd-l-250", // France
  218: "wd-l-218", // Ecuador
  630: "wd-l-630", // Puerto Rico
  388: "wd-l-388", // Jamaica
  192: "wd-l-192", // Cuba
  716: "wd-l-716", // Zimbabwe
  72: "wd-l-72", // Botswana
  516: "wd-l-516", // Namibia
  686: "wd-l-686", // Senegal
  466: "wd-l-466", // Mali
  478: "wd-l-478", // Mauritania
  204: "wd-l-204", // Benin
  562: "wd-l-562", // Niger
  566: "wd-l-566", // Nigeria
  120: "wd-l-120", // Cameroon
  768: "wd-l-768", // Togo
  288: "wd-l-288", // Ghana
  384: "wd-l-384", // Côte d'Ivoire
  324: "wd-l-324", // Guinea
  624: "wd-l-624", // Guinea-Bissau
  430: "wd-l-430", // Liberia
  694: "wd-l-694", // Sierra Leone
  854: "wd-l-854", // Burkina Faso
  140: "wd-l-140", // Central African Rep.
  178: "wd-l-178", // Congo
  266: "wd-l-266", // Gabon
  226: "wd-l-226", // Eq. Guinea
  894: "wd-l-894", // Zambia
  454: "wd-l-454", // Malawi
  508: "wd-l-508", // Mozambique
  748: "wd-l-748", // eSwatini
  24: "wd-l-24", // Angola
  108: "wd-l-108", // Burundi
  376: "wd-l-376", // Israel
  422: "wd-l-422", // Lebanon
  450: "wd-l-450", // Madagascar
  275: "wd-l-275", // Palestine
  270: "wd-l-270", // Gambia
  788: "wd-l-788", // Tunisia
  12: "wd-l-12", // Algeria
  400: "wd-l-400", // Jordan
  784: "wd-l-784", // United Arab Emirates
  634: "wd-l-634", // Qatar
  414: "wd-l-414", // Kuwait
  368: "wd-l-368", // Iraq
  512: "wd-l-512", // Oman
  548: "wd-l-548", // Vanuatu
  116: "wd-l-116", // Cambodia
  764: "wd-l-764", // Thailand
  418: "wd-l-418", // Laos
  104: "wd-l-104", // Myanmar
  704: "wd-l-704", // Vietnam
  408: "wd-l-408", // North Korea
  410: "wd-l-410", // South Korea
  496: "wd-l-496", // Mongolia
  356: "wd-l-356", // India
  50: "wd-l-50", // Bangladesh
  64: "wd-l-64", // Bhutan
  524: "wd-l-524", // Nepal
  586: "wd-l-586", // Pakistan
  4: "wd-l-4", // Afghanistan
  762: "wd-l-762", // Tajikistan
  417: "wd-l-417", // Kyrgyzstan
  795: "wd-l-795", // Turkmenistan
  364: "wd-l-364", // Iran
  760: "wd-l-760", // Syria
  51: "wd-l-51", // Armenia
  752: "wd-l-752", // Sweden
  112: "wd-l-112", // Belarus
  804: "wd-l-804", // Ukraine
  616: "wd-l-616", // Poland
  40: "wd-l-40", // Austria
  348: "wd-l-348", // Hungary
  498: "wd-l-498", // Moldova
  642: "wd-l-642", // Romania
  440: "wd-l-440", // Lithuania
  428: "wd-l-428", // Latvia
  233: "wd-l-233", // Estonia
  276: "wd-l-276", // Germany
  100: "wd-l-100", // Bulgaria
  300: "wd-l-300", // Greece
  792: "wd-l-792", // Turkey
  8: "wd-l-8", // Albania
  191: "wd-l-191", // Croatia
  756: "wd-l-756", // Switzerland
  442: "wd-l-442", // Luxembourg
  56: "wd-l-56", // Belgium
  528: "wd-l-528", // Netherlands
  620: "wd-l-620", // Portugal
  724: "wd-l-724", // Spain
  372: "wd-l-372", // Ireland
  540: "wd-l-540", // New Caledonia
  90: "wd-l-90", // Solomon Is.
  554: "wd-l-554", // New Zealand
  36: "wd-l-36", // Australia
  144: "wd-l-144", // Sri Lanka
  156: "wd-l-156", // China
  158: "wd-l-158", // Taiwan
  380: "wd-l-380", // Italy
  208: "wd-l-208", // Denmark
  826: "wd-l-826", // United Kingdom
  352: "wd-l-352", // Iceland
  31: "wd-l-31", // Azerbaijan
  268: "wd-l-268", // Georgia
  608: "wd-l-608", // Philippines
  458: "wd-l-458", // Malaysia
  96: "wd-l-96", // Brunei
  705: "wd-l-705", // Slovenia
  246: "wd-l-246", // Finland
  703: "wd-l-703", // Slovakia
  203: "wd-l-203", // Czechia
  232: "wd-l-232", // Eritrea
  392: "wd-l-392", // Japan
  600: "wd-l-600", // Paraguay
  887: "wd-l-887", // Yemen
  682: "wd-l-682", // Saudi Arabia
  10: "wd-l-10", // Antarctica
  196: "wd-l-196", // Cyprus
  504: "wd-l-504", // Morocco
  818: "wd-l-818", // Egypt
  434: "wd-l-434", // Libya
  231: "wd-l-231", // Ethiopia
  262: "wd-l-262", // Djibouti
  800: "wd-l-800", // Uganda
  646: "wd-l-646", // Rwanda
  70: "wd-l-70", // Bosnia and Herz.
  807: "wd-l-807", // Macedonia
  688: "wd-l-688", // Serbia
  499: "wd-l-499", // Montenegro
  780: "wd-l-780", // Trinidad and Tobago
  728: "wd-l-728", // S. Sudan
};

const WorldMap = React.memo(function WorldMap({ activeQuestion, onResult, interactiveMode = true, showCorrectAnswer = false, wrongItems = [], language, allowedItemIds }: WorldMapProps) {
  const activeLang: Language = language || (localStorage.getItem('geo_language') as Language) || 'nl';
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countriesGeo, setCountriesGeo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);

  const [zoomScale, setZoomScale] = useState(1);

  // Combine worldCapitals and worldJSON.steden into a unified cities layer
  const allWorldCities = React.useMemo(() => {
    const capList: GeoFeature[] = [...worldCapitals];
    const capIds = new Set(capList.map(c => c.id));
    const steden = (worldJSON as any).steden || [];
    steden.forEach((s: any) => {
      if (!capIds.has(s.id)) {
        capList.push({
          id: s.id,
          name: s.name,
          category: 'city',
          coordinates: s.coordinates as [number, number],
          alternatives: s.alternatives
        });
      }
    });
    return capList;
  }, []);

  // Active layers switches
  const [showCountries, setShowCountries] = useState(true);
  const [showCapitals, setShowCapitals] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showMountains, setShowMountains] = useState(true);
  const [showSeas, setShowSeas] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Fetch geographic boundaries
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(res => res.json())
      .then(data => {
        const countriesArr = topojson.feature(data, data.objects.countries) as any;
        setCountriesGeo(countriesArr.features || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading world atlas borders", err);
        setLoading(false);
      });
  }, []);

  // Map settings and sizes
  const width = 800;
  const height = 460;

  // Projection setup (Equirectangular fits the entire world in a standard widescreen aspect ratio)
  const projection = d3.geoEquirectangular()
    .scale(125)
    .translate([width / 2, height / 2 + 35]);

  const pathGenerator = d3.geoPath().projection(projection);

  // Clear states when target changes
  useEffect(() => {
    setClickedItem(null);
    setIsCorrectState(null);
  }, [activeQuestion]);

  const handleEntityClick = (itemId: string, itemName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactiveMode || showCorrectAnswer) return;

    setClickedItem(itemId);

    if (activeQuestion) {
      // Validate correct answers
      const isCorrect = itemId === activeQuestion.targetId || 
                        itemId.replace('capital-', '') === activeQuestion.targetId.replace('capital-', '') ||
                        itemName.toLowerCase() === activeQuestion.correctAnswer.toLowerCase() ||
                        (activeQuestion.geoItem?.name && itemName.toLowerCase() === activeQuestion.geoItem.name.toLowerCase()) ||
                        (activeQuestion.geoItem?.naam && itemName.toLowerCase() === activeQuestion.geoItem.naam.toLowerCase()) ||
                        (activeQuestion.geoItem?.capital && itemName.toLowerCase() === activeQuestion.geoItem.capital.toLowerCase()) ||
                        (activeQuestion.geoItem?.hoofdstad && itemName.toLowerCase() === activeQuestion.geoItem.hoofdstad.toLowerCase());
      setIsCorrectState(isCorrect);

      if (onResult) {
        onResult(isCorrect, itemName, itemId);
      }
    }
  };

  const zoomRef = useRef<any>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    let rafId: number | null = null;
    let lastK = 1;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (e) => {
        svg.select("g#map-zoom-group").attr("transform", e.transform as string);
        if (Math.abs(e.transform.k - lastK) > 0.01) {
          lastK = e.transform.k;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            setZoomScale(e.transform.k);
          });
        }
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current as any).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current as any).transition().duration(300).call(zoomRef.current.scaleBy, 0.66);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Layer Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 sm:p-3.5 border border-blue-900/40 rounded-2xl backdrop-blur-md" style={{ backgroundColor: "#172540" }}>
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-bold uppercase text-slate-300">Zichtbare Lagen:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 max-w-full">
          <button 
            onClick={() => setShowCountries(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showCountries ? 'bg-blue-600/30 border-blue-400 text-blue-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🌍 Wereldlanden
          </button>
          <button 
            onClick={() => setShowCapitals(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showCapitals ? 'bg-amber-600/30 border-amber-400 text-amber-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ Wereldsteden
          </button>
          <button 
            onClick={() => setShowRivers(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showRivers ? 'bg-sky-600/30 border-sky-400 text-sky-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🌊 Wereldriveren
          </button>
          <button 
            onClick={() => setShowMountains(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showMountains ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⛰️ Gebergten & Plateaus
          </button>
          <button 
            onClick={() => setShowSeas(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showSeas ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚓ Zeeën & Oceanen
          </button>

          {/* Label switch option */}
          <button
            onClick={() => !interactiveMode && setShowLabels(prev => !prev)}
            disabled={interactiveMode}
            title={interactiveMode ? "Namen zijn verborgen tijdens de quiz" : "Schakel plaatsnamen in of uit"}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              interactiveMode 
                ? 'opacity-40 bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed'
                : (showLabels 
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-sm cursor-pointer' 
                    : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200 cursor-pointer')
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Namen {interactiveMode ? '(Quiz)' : (showLabels ? '(Aan)' : '(Uit)')}
          </button>
        </div>
      </div>

      {/* Main Map SVG Area */}
      <div className="relative border border-blue-900/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#0f172a" }}>
        {loading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3 z-30">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-slate-400">Cartografie van de Wereld laden...</p>
          </div>
        )}

        {/* HUD Game Instruction */}
        {interactiveMode && activeQuestion && (
          <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-20 px-3 py-1.5 sm:px-4 sm:py-2 border border-blue-500/30 rounded-xl backdrop-blur-md shadow-lg" style={{ backgroundColor: "#172540" }}>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-sky-300 block tracking-widest">WERELD VRAAG:</span>
            <span className="text-xs sm:text-base font-extrabold tracking-tight text-white block mt-0.5">
              {activeQuestion.category === 'capital'
                ? `Klik op de hoofdstad: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'city'
                ? `Klik op de stad: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'country'
                ? `Klik op het land: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'river'
                ? `Klik op de rivier: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'mountain'
                ? `Klik op het gebergte: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'sea' || activeQuestion.category === 'ocean'
                ? `Klik op de zee / oceaan: ${activeQuestion.correctAnswer}`
                : `Klik op het object: ${activeQuestion.geoItem?.name || activeQuestion.correctAnswer}`
              }
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex flex-col gap-2 z-10">
          <button onClick={handleZoomIn} className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-2xl font-bold cursor-pointer transition-all">+</button>
          <button onClick={handleZoomOut} className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-2xl font-bold cursor-pointer transition-all">-</button>
        </div>

        <svg 
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[calc(100dvh-180px)] min-h-[300px] sm:min-h-[440px] select-none text-slate-100 touch-pan-x touch-pan-y"
          style={{ cursor: interactiveMode ? 'crosshair' : 'grab' }}
        >
          <g id="map-zoom-group">
            {/* World Ocean backdrop Seterra color */}
            <rect width={width} height={height} fill="#a9d4f9" />

            {/* Render Countries Layer */}
            <g id="world-countries-layer">
              {countriesGeo.map((feature, i) => {
                const numericId = Number(feature.id);
                const mappedId = countryIdMap[numericId] || `country-${numericId}`;
                const rawCountryName = feature.properties.name || "Land";
                const countryName = translateName(rawCountryName, activeLang);

                let fill = '#ffffff';
                let stroke = '#64748b';
                
                const isHovered = showCountries && hoveredItem === mappedId;
                const isWrong = showCountries && wrongItems.includes(mappedId);
                const isClicked = showCountries && clickedItem === mappedId;
                const isTheCorrectOne = showCountries && (showCorrectAnswer || (isClicked && isCorrectState)) && mappedId === activeQuestion?.targetId;

                if (isHovered) {
                  fill = '#bae6fd';
                }

                if (isWrong) {
                  fill = '#f43f5e';
                  stroke = '#be123c';
                }

                if (isClicked) {
                  fill = isCorrectState ? '#10b981' : '#f43f5e';
                  stroke = isCorrectState ? '#047857' : '#be123c';
                }

                if (isTheCorrectOne) {
                  fill = '#10b981';
                  stroke = '#047857';
                }

                if (!showCountries) {
                  fill = '#f1f5f9';
                }

                const centroid = pathGenerator.centroid(feature);
                const shouldShowLabel = showCountries && ((!allowedItemIds || allowedItemIds.includes(mappedId))) && ((!interactiveMode && showLabels) || isWrong || clickedItem === mappedId || isTheCorrectOne);

                return (
                  <g key={`wd-country-grp-${i}`}>
                    <path
                      d={pathGenerator(feature) || ''}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="0.6"
                      className={`transition-colors duration-155 ${showCountries ? 'cursor-pointer' : 'pointer-events-none'}`}
                      onMouseEnter={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(mappedId) : undefined}
                      onMouseLeave={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? () => setHoveredItem(null) : undefined}
                      onClick={(showCountries && (!allowedItemIds || allowedItemIds.includes(mappedId))) ? (e) => handleEntityClick(mappedId, countryName, e) : undefined}
                    />
                    {shouldShowLabel && centroid && !isNaN(centroid[0]) && (
                      <g transform={`translate(${centroid[0]}, ${centroid[1]}) scale(${1 / zoomScale})`}>
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                          className="text-[11px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                        >
                          {countryName}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Render Mountain Ranges Layer */}
            <AnimatePresence>
              {showMountains && (
                <motion.g 
                  key="world-mountains-layer"
                  id="world-mountains-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {worldMountains.map((mount, i) => {
                    const mountName = translateName(mount.name, activeLang);
                    const isHovered = hoveredItem === mount.id;
                    const isWrong = wrongItems.includes(mount.id);
                    const isClicked = clickedItem === mount.id;
                    const coords = mount.coordinates;

                    if (!coords) return null;
                    const [projX, projY] = projection(coords) || [0, 0];

                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && mount.id === activeQuestion?.targetId;
                    let mountainFill = isWrong
                      ? '#f43f5e'
                      : (isClicked 
                          ? (isCorrectState ? '#10b981' : '#f43f5e') 
                          : (isTheCorrectOne ? '#10b981' : (isHovered ? '#f59e0b' : '#b45309')));

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === mount.id || isTheCorrectOne;

                    // Render polygon of the mountain range if available
                    const projectedPolygon = mount.polygon
                      ? (mount.polygon.map(pt => projection(pt)).filter(Boolean) as [number, number][])
                      : null;

                    let polygonPathData = '';
                    if (projectedPolygon && projectedPolygon.length >= 3) {
                      polygonPathData = projectedPolygon.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ') + ' Z';
                    }

                    return (
                      <g 
                        key={`wd-mount-${i}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredItem(mount.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => handleEntityClick(mount.id, mountName, e)}
                      >
                        {polygonPathData ? (
                          <>
                            {/* Real GeoJSON mountain range contour polygon */}
                            <path
                              d={polygonPathData}
                              fill={mountainFill}
                              fillOpacity={isHovered ? "0.85" : "0.65"}
                              stroke={isHovered ? "#fbbf24" : "#78350f"}
                              strokeWidth={isHovered ? `${2.2 / Math.sqrt(zoomScale)}` : `${1.2 / Math.sqrt(zoomScale)}`}
                              strokeDasharray={isHovered ? "none" : "3 1"}
                              strokeLinejoin="round"
                              className="transition-all duration-150"
                            />
                            {/* Inner peak hatching line along range center */}
                            {projectedPolygon && projectedPolygon.length > 4 && (
                              <path
                                d={`M ${projectedPolygon[0][0]},${projectedPolygon[0][1]} L ${projectedPolygon[Math.floor(projectedPolygon.length/2)][0]},${projectedPolygon[Math.floor(projectedPolygon.length/2)][1]}`}
                                stroke="#fef3c7"
                                strokeWidth={1.2 / Math.sqrt(zoomScale)}
                                strokeDasharray="4 2"
                                strokeLinecap="round"
                                className="pointer-events-none opacity-80"
                              />
                            )}
                          </>
                        ) : (
                          /* Fallback multi-peak mountain range icon if polygon not defined */
                          <g transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                            <path
                              d="M -16,6 L -10,-7 L -5,-1 L 0,-14 L 6,1 L 11,-8 L 17,6 Z"
                              fill={mountainFill}
                              stroke="#fef3c7"
                              strokeWidth="1"
                              strokeLinejoin="round"
                            />
                            <path d="M -10,-7 L -8,-2 M 0,-14 L 2,-6 M 11,-8 L 13,-3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                          </g>
                        )}
                        {shouldShowLabel && (
                          <g transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                            <rect x={-(mountName.length * 4 + 5)} y="-10" width={mountName.length * 8 + 10} height="18" rx="4" fill="#78350f" stroke="#ffffff" strokeWidth="1" />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              className="text-[10px] font-sans font-black fill-white pointer-events-none"
                            >
                              {mountName}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Render Rivers Layer */}
            <AnimatePresence>
              {showRivers && (
                <motion.g 
                  key="world-rivers-layer"
                  id="world-rivers-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {worldRivers.map((river, i) => {
                    const riverName = translateName(river.name, activeLang);
                    const isHovered = hoveredItem === river.id;
                    const isWrong = wrongItems.includes(river.id);
                    const isClicked = clickedItem === river.id;
                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && activeQuestion?.targetId === river.id;
                    const lineGenerator = d3.line().curve(d3.curveBasis);

                    if (!river.coordinatesList) return null;

                    const projectedPoints = river.coordinatesList.map(coord => projection(coord) || [0, 0]);
                    const pathData = lineGenerator(projectedPoints as [number, number][]);

                    let strokeColor = isWrong
                      ? '#f43f5e'
                      : (isClicked 
                          ? (isCorrectState ? '#10b981' : '#f43f5e') 
                          : (isTheCorrectOne ? '#10b981' : (isHovered ? '#2563eb' : '#0284c7')));
                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === river.id || isTheCorrectOne;

                    return (
                      <g key={`wd-river-${i}`}>
                        <path
                          d={pathData || ''}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHovered ? `${3 / Math.sqrt(zoomScale)}` : `${1.8 / Math.sqrt(zoomScale)}`}
                          className="transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredItem(river.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={(e) => handleEntityClick(river.id, riverName, e)}
                        />
                        {river.coordinates && shouldShowLabel && (() => {
                          const [lblX, lblY] = projection(river.coordinates) || [0, 0];
                          return (
                            <g transform={`translate(${lblX}, ${lblY}) scale(${1 / zoomScale})`}>
                              <text
                                x={0}
                                y={-4}
                                textAnchor="middle"
                                style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                                className="text-[10.5px] font-sans font-extrabold fill-sky-950 pointer-events-none"
                              >
                                {riverName}
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Render World Cities / Capitals Layer */}
            <AnimatePresence>
              {showCapitals && (
                <motion.g 
                  key="world-capitals-layer"
                  id="world-capitals-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {allWorldCities.map((cap, i) => {
                    const capName = translateName(cap.name, activeLang);
                    if (!cap.coordinates) return null;
                    const [projX, projY] = projection(cap.coordinates) || [0, 0];

                    const isHovered = hoveredItem === cap.id;
                    const isWrong = wrongItems.includes(cap.id);
                    const isClicked = clickedItem === cap.id;
                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && activeQuestion?.targetId === cap.id;

                    let color = '#f59e0b';
                    let radius = isHovered ? 5.5 : 3.5;

                    if (isWrong) {
                      color = '#f43f5e';
                      radius = 6;
                    }
                    if (isClicked) {
                      color = isCorrectState ? '#10b981' : '#f43f5e';
                      radius = 6.5;
                    }
                    if (isTheCorrectOne) {
                      color = '#10b981';
                      radius = 7;
                    }

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === cap.id || isTheCorrectOne;

                    return (
                      <g 
                        key={`wd-cap-${i}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredItem(cap.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => handleEntityClick(cap.id, capName, e)}
                      >
                        <g transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                          <circle
                            cx={0}
                            cy={0}
                            r={radius}
                            fill={color}
                            stroke="#0f172a"
                            strokeWidth="0.8"
                          />
                          {shouldShowLabel && (
                            <text
                              x={0}
                              y={-7}
                              textAnchor="middle"
                              style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                              className="text-[10.5px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                            >
                              {capName}
                            </text>
                          )}
                        </g>
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Render Seas & Oceans Layer */}
            <AnimatePresence>
              {showSeas && (
                <motion.g 
                  key="world-seas-layer"
                  id="world-seas-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {worldSeas.map((sea, i) => {
                    const seaName = translateName(sea.name, activeLang);
                    if (!sea.coordinates) return null;
                    const [projX, projY] = projection(sea.coordinates) || [0, 0];

                    const isHovered = hoveredItem === sea.id;
                    const isWrong = wrongItems.includes(sea.id);
                    const isClicked = clickedItem === sea.id;
                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && activeQuestion?.targetId === sea.id;

                    let color = '#0284c7';
                    let radius = isHovered ? 9 : 6.5;

                    if (isWrong) {
                      color = '#f43f5e';
                      radius = 8.5;
                    }
                    if (isClicked) {
                      color = isCorrectState ? '#10b981' : '#f43f5e';
                      radius = 9;
                    }
                    if (isTheCorrectOne) {
                      color = '#10b981';
                      radius = 10;
                    }

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === sea.id || isTheCorrectOne;

                    return (
                      <g 
                        key={`wd-sea-${i}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredItem(sea.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => handleEntityClick(sea.id, seaName, e)}
                      >
                        <g transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                          <circle
                            cx={0}
                            cy={0}
                            r={radius + 4}
                            fill={isHovered ? '#38bdf8' : color}
                            fillOpacity={isHovered ? 0.35 : 0.2}
                            className={isHovered ? 'animate-pulse' : ''}
                          />
                          <circle
                            cx={0}
                            cy={0}
                            r={radius}
                            fill={isHovered ? '#38bdf8' : color}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={0}
                            y={3}
                            textAnchor="middle"
                            className="text-[9px] pointer-events-none select-none"
                            fill="#ffffff"
                          >
                            ⚓
                          </text>
                          {shouldShowLabel && (
                            <g transform="translate(0, 16)">
                              <rect
                                x={-(seaName.length * 3.8 + 6)}
                                y="-10"
                                width={seaName.length * 7.6 + 12}
                                height="18"
                                rx="4"
                                fill="#0369a1"
                                stroke="#ffffff"
                                strokeWidth="1"
                              />
                              <text
                                x={0}
                                y={2}
                                textAnchor="middle"
                                className="text-[10px] font-sans font-black fill-white pointer-events-none"
                              >
                                {seaName}
                              </text>
                            </g>
                          )}
                        </g>
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </svg>
      </div>
    </div>
  );
});

export default WorldMap;
