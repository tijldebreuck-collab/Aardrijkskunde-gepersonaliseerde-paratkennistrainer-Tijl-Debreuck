import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import provincesData from '../data/belgium.json';
import { belgiumRivers, belgiumHighways, GeoFeature } from '../data/geoData';
import { Layers, Tag } from 'lucide-react';
import { translateName, Language } from '../utils/language';

interface BelgiumMapProps {
  activeQuestion?: {
    id: string;
    targetId: string;
    correctAnswer: string;
    geoItem?: any;
    category?: string;
  } | null;
  onResult?: (isCorrect: boolean, chosenVal: string, clickedId: string) => void;
  interactiveMode?: boolean;
  showCorrectAnswer?: boolean;
  wrongItems?: string[];
  language?: Language;
}

const BelgiumMap = React.memo(function BelgiumMap({ activeQuestion, onResult, interactiveMode = true, showCorrectAnswer = false, wrongItems = [], language }: BelgiumMapProps) {
  const activeLang: Language = language || (localStorage.getItem('geo_language') as Language) || 'nl';
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);

  const [zoomScale, setZoomScale] = useState(1);

  // Active layers switches
  const [showProvinces, setShowProvinces] = useState(true);
  const [showCapitals, setShowCapitals] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showHighways, setShowHighways] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Map settings and sizes
  const width = 800;
  const height = 460;

  // Projection setup for Belgium: Mercator centered at [4.4699, 50.5039]
  const projection = d3.geoMercator()
    .center([4.4699, 50.5039])
    .scale(10000) // Heavily centered on Belgium
    .translate([width / 2, height / 2 + 10]);

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

  // Build polygon path drawing utilizing projected coordinates list
  const getPolygonPathData = (polygonPoints: [number, number][]) => {
    if (!polygonPoints) return '';
    const projected = polygonPoints.map(point => {
      const projectedPoint = projection(point);
      return projectedPoint ? `${projectedPoint[0]},${projectedPoint[1]}` : '';
    }).filter(Boolean);
    return `M ${projected.join(' L ')} Z`;
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
            onClick={() => setShowProvinces(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showProvinces ? 'bg-blue-600/30 border-blue-400 text-blue-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🇧🇪 Provincies
          </button>
          <button 
            onClick={() => setShowCapitals(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showCapitals ? 'bg-amber-600/30 border-amber-400 text-amber-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ Provinciehoofdsteden
          </button>
          <button 
            onClick={() => setShowRivers(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showRivers ? 'bg-sky-600/30 border-sky-400 text-sky-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🌊 Rivieren
          </button>
          <button 
            onClick={() => setShowHighways(p => !p)}
            className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showHighways ? 'bg-orange-600/30 border-orange-400 text-orange-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            🛣️ Autosnelwegen
          </button>

          {/* Toggle label names option (Study mode only) */}
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
        {/* HUD Game Instruction */}
        {interactiveMode && activeQuestion && (
          <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-20 px-3 py-1.5 sm:px-4 sm:py-2 border border-blue-500/30 rounded-xl backdrop-blur-md shadow-lg" style={{ backgroundColor: "#172540" }}>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-sky-300 block tracking-widest">BELGISCHE VRAAG:</span>
            <span className="text-xs sm:text-base font-extrabold tracking-tight text-white block mt-0.5">
              {activeQuestion.geoItem?.capital && activeQuestion.category === 'capital'
                ? `Klik op de provinciehoofdstad: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'highway'
                ? `Klik op de autosnelweg: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'province'
                ? `Klik op de provincie: ${activeQuestion.correctAnswer}`
                : activeQuestion.category === 'river'
                ? `Klik op de rivier: ${activeQuestion.correctAnswer}`
                : `Klik op het geografisch object: ${activeQuestion.geoItem?.name || activeQuestion.correctAnswer}`
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
            {/* Seterra Light Ocean Backdrop */}
            <rect width={width} height={height} fill="#a9d4f9" />

            {/* Render Neighboring Countries Layer */}
            <g id="neighbors-layer">
              {((provincesData as any).neighbors || []).map((neighbor: any, i: number) => {
                const pathData = getPolygonPathData(neighbor.polygon);
                return (
                  <g key={`neighbor-${neighbor.id}-${i}`}>
                    <path
                      d={pathData}
                      fill="#dde1e5"
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </g>

            {/* Render Provinces Layer */}
            <g id="provinces-layer">
              {provincesData.provinces.map((province: any, i) => {
                const provId = province.id;
                const rawProvName = province.name;
                const provName = translateName(rawProvName, activeLang);
                const pathData = getPolygonPathData(province.polygon);

                let fill = '#ffffea';
                let stroke = '#475569';
                
                const isHovered = showProvinces && hoveredItem === provId;
                const isWrong = showProvinces && wrongItems.includes(provId);
                const isClicked = showProvinces && clickedItem === provId;
                const isTheCorrectOne = showProvinces && (showCorrectAnswer || (isClicked && isCorrectState)) && provId === activeQuestion?.targetId;

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

                if (!showProvinces) {
                  fill = '#f1f5f9';
                }

                const shouldShowLabel = showProvinces && ((!interactiveMode && showLabels) || isWrong || clickedItem === provId || isTheCorrectOne);
                const [centroidX, centroidY] = province.coordinates ? projection(province.coordinates) || [0, 0] : [0, 0];

                return (
                  <g key={`province-grp-${i}`}>
                    <path
                      d={pathData}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1.2"
                      className={`transition-colors duration-155 ${showProvinces ? 'cursor-pointer' : 'pointer-events-none'}`}
                      onMouseEnter={showProvinces ? () => setHoveredItem(provId) : undefined}
                      onMouseLeave={showProvinces ? () => setHoveredItem(null) : undefined}
                      onClick={showProvinces ? (e) => handleEntityClick(provId, provName, e) : undefined}
                    />
                    {shouldShowLabel && centroidX > 0 && (
                      <g transform={`translate(${centroidX}, ${centroidY}) scale(${1 / zoomScale})`}>
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3.5px', strokeLinejoin: 'round' }}
                          className="text-[12px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                        >
                          {provName}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Render Brussels Enclave Layer */}
            {(provincesData as any).brussels && (() => {
              const bru = (provincesData as any).brussels;
              const bruCapital = translateName(bru.capital, activeLang);
              const pathData = getPolygonPathData(bru.polygon);
              const isHovered = hoveredItem === bru.id;
              const isWrong = wrongItems.includes(bru.id);
              const isClicked = clickedItem === bru.id;
              const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && bru.id === activeQuestion?.targetId;

              let fill = '#fed7aa';
              let stroke = '#c2410c';

              if (isHovered) fill = '#fde68a';
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

              const [centroidX, centroidY] = projection(bru.coordinates) || [0, 0];
              const shouldShowLabel = showProvinces && ((!interactiveMode && showLabels) || isWrong || clickedItem === bru.id || isTheCorrectOne);

              return (
                <g id="brussels-enclave-layer">
                  <path
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="1.5"
                    className="transition-colors duration-155 cursor-pointer"
                    onMouseEnter={() => setHoveredItem(bru.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={(e) => handleEntityClick(bru.id, bruCapital, e)}
                  />
                  {shouldShowLabel && (
                    <g transform={`translate(${centroidX}, ${centroidY}) scale(${1 / zoomScale})`}>
                      <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                        className="text-[11px] font-sans font-black fill-amber-950 pointer-events-none"
                      >
                        {bruCapital}
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}

            {/* Render Highways Layer */}
            <AnimatePresence>
              {showHighways && (
                <motion.g 
                  key="belgium-highways-layer"
                  id="belgium-highways-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {belgiumHighways.map((hw, i) => {
                    const hwName = translateName(hw.name, activeLang);
                    const isHovered = hoveredItem === hw.id;
                    const isWrong = wrongItems.includes(hw.id);
                    const isClicked = clickedItem === hw.id;
                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && activeQuestion?.targetId === hw.id;
                    const lineGenerator = d3.line().curve(d3.curveBasis);
                    if (!hw.coordinatesList) return null;

                    const projectedPoints = hw.coordinatesList.map(coord => projection(coord) || [0, 0]);
                    const pathData = lineGenerator(projectedPoints as [number, number][]);

                    let strokeColor = isWrong
                      ? '#f43f5e'
                      : (isTheCorrectOne
                          ? '#10b981'
                          : isClicked
                            ? (isCorrectState ? '#10b981' : '#f43f5e')
                            : (isHovered ? '#1d4ed8' : '#2563eb'));

                    let badgeBg = isWrong
                      ? '#f43f5e'
                      : (isTheCorrectOne
                          ? '#10b981'
                          : isClicked
                            ? (isCorrectState ? '#10b981' : '#f43f5e')
                            : (isHovered ? '#1d4ed8' : '#1e40af'));

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === hw.id || isTheCorrectOne;

                    return (
                      <g key={`bel-hw-${i}`}>
                        {/* Transparent wider hit path for easier click & hover */}
                        <path
                          d={pathData || ''}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="16"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredItem(hw.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={(e) => handleEntityClick(hw.id, hwName, e)}
                        />
                        <path
                          d={pathData || ''}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHovered || isClicked || isTheCorrectOne || isWrong ? `${5 / Math.sqrt(zoomScale)}` : `${3.5 / Math.sqrt(zoomScale)}`}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-all duration-150 cursor-pointer pointer-events-none drop-shadow-sm"
                        />
                        {hw.coordinates && shouldShowLabel && (() => {
                          const [lblX, lblY] = projection(hw.coordinates) || [0, 0];
                          return (
                            <g transform={`translate(${lblX}, ${lblY - 6}) scale(${1 / zoomScale})`} className="pointer-events-none">
                              <rect x="-16" y="-10" width="32" height="18" rx="4" fill={badgeBg} stroke="#ffffff" strokeWidth="1.2" />
                              <text x="0" y="3.5" textAnchor="middle" className="text-[10.5px] font-sans font-black fill-white">
                                {hwName}
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

            {/* Render Rivers Layer */}
            <AnimatePresence>
              {showRivers && (
                <motion.g 
                  key="belgium-rivers-layer"
                  id="belgium-rivers-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {belgiumRivers.map((river, i) => {
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
                          : (isTheCorrectOne ? '#10b981' : (isHovered ? '#60a5fa' : '#38bdf8')));
                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === river.id || isTheCorrectOne;

                    return (
                      <g key={`bel-river-${i}`}>
                        <path
                          d={pathData || ''}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHovered ? `${4 / Math.sqrt(zoomScale)}` : `${2.2 / Math.sqrt(zoomScale)}`}
                          className="transition-all duration-155 cursor-pointer"
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
                                className="text-[11px] font-sans font-extrabold fill-sky-950 pointer-events-none"
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

            {/* Render Capitals Layer */}
            <AnimatePresence>
              {showCapitals && (
                <motion.g 
                  key="belgium-capitals-layer"
                  id="belgium-capitals-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {provincesData.provinces.map((prov: any, i) => {
                    const provCapital = translateName(prov.capital, activeLang);
                    if (!prov.coordinates) return null;
                    const [projX, projY] = projection(prov.coordinates) || [0, 0];

                    const capId = `capital-${prov.id}`;
                    const isHovered = hoveredItem === capId;
                    const isWrong = wrongItems.includes(capId);
                    const isClicked = clickedItem === capId;
                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && activeQuestion?.targetId === capId;

                    let color = '#f59e0b';
                    let radius = isHovered ? 6 : 4;

                    if (isWrong) {
                      color = '#f43f5e';
                      radius = 6.5;
                    }
                    if (isClicked) {
                      color = isCorrectState ? '#10b981' : '#f43f5e';
                      radius = 7;
                    }
                    if (isTheCorrectOne) {
                      color = '#10b981';
                      radius = 7.5;
                    }

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === capId || isTheCorrectOne;

                    return (
                      <g 
                        key={`bel-cap-${i}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredItem(capId)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={(e) => handleEntityClick(capId, provCapital, e)}
                      >
                        <g transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                          <circle
                            cx={0}
                            cy={0}
                            r={radius}
                            fill={color}
                            stroke="#0f172a"
                            strokeWidth="1.2"
                          />
                          {shouldShowLabel && (
                            <text
                              x={0}
                              y={-8}
                              textAnchor="middle"
                              style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                              className="text-[11px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                            >
                              {provCapital}
                            </text>
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

export default BelgiumMap;
