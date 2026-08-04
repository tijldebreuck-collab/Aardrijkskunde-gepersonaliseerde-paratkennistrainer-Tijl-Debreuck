import re
with open('src/components/BelgiumMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("belgiumHighways, GeoFeature", "belgiumHighways, belgiumMountains, GeoFeature")
content = content.replace("const [showHighways, setShowHighways] = useState(true);", "const [showHighways, setShowHighways] = useState(true);\n  const [showMountains, setShowMountains] = useState(true);")

# Add the mountains rendering layer before </svg> or somewhere near capitals. Let's find capitals.
# Search for {/* Render Capitals Layer */}

mountain_layer = """
            {/* Render Mountains Layer */}
            <AnimatePresence>
              {showMountains && (
                <motion.g 
                  key="be-mountains-layer"
                  id="be-mountains-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {belgiumMountains.map((mount, i) => {
                    const mountName = translateName(mount.name, activeLang);
                    const isHovered = hoveredItem === mount.id;
                    const isWrong = wrongItems.includes(mount.id);
                    const isClicked = clickedItem === mount.id;
                    const coords = mount.coordinates;

                    if (!coords) return null;
                    const [projX, projY] = projection(coords) || [0, 0];

                    const isTheCorrectOne = (showCorrectAnswer || (isClicked && isCorrectState)) && mount.id === activeQuestion?.targetId;

                    let fill = '#ffffff';
                    let stroke = '#64748b';

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

                    const shouldShowLabel = (!interactiveMode && showLabels) || isWrong || clickedItem === mount.id || isTheCorrectOne;

                    return (
                      <g key={`be-mount-${i}`} transform={`translate(${projX}, ${projY}) scale(${1 / zoomScale})`}>
                        <path
                          d="M0,-8 L6,2 L-6,2 Z"
                          fill={fill}
                          stroke={stroke}
                          strokeWidth="1.5"
                          className={`transition-all duration-300 ${interactiveMode && !showCorrectAnswer ? 'cursor-pointer' : 'pointer-events-none'}`}
                          onMouseEnter={() => setHoveredItem(mount.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={(e) => handleEntityClick(mount.id, mountName, e)}
                        />
                        {shouldShowLabel && (
                          <text
                            x={0}
                            y={12}
                            textAnchor="middle"
                            style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                            className="text-[10px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                          >
                            {mountName}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>
"""

content = content.replace("{/* Render Capitals Layer */}", mountain_layer + "\n            {/* Render Capitals Layer */}")

with open('src/components/BelgiumMap.tsx', 'w') as f:
    f.write(content)

