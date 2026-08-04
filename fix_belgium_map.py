import re

with open('src/components/BelgiumMap.tsx', 'r') as f:
    content = f.read()

content = content.replace("import provincesData from '../data/belgium.json';", "import provincesData from '../data/belgium.json';\nimport belgiumProvincesGeo from '../data/belgium-provinces.json';")

# Replace getPolygonPathData usage with geoPath
content = content.replace(
    "const projection = d3.geoMercator()",
    "const projection = d3.geoMercator()"
)
content = content.replace(
    "const pathGenerator = d3.geoPath().projection(projection);",
    ""
)
# add pathGenerator
if "const pathGenerator =" not in content:
    content = content.replace("const projection = d3.geoMercator()", "const pathGenerator = d3.geoPath().projection(projection);\n  const projection = d3.geoMercator()")
    # wait, projection must be defined first
    
content = re.sub(
    r'const projection = d3\.geoMercator\(\)\s*\.center\(\[4\.4699, 50\.5039\]\)\s*\.scale\(\(width \* 10\)\)\s*\.translate\(\[width / 2, height / 2 \+ 20\]\);',
    r'const projection = d3.geoMercator()\n    .center([4.4699, 50.5039])\n    .scale((width * 10.5))\n    .translate([width / 2, height / 2 + 20]);\n  const pathGenerator = d3.geoPath().projection(projection);',
    content
)

# Render Provinces Layer
prov_layer_regex = re.compile(r'\{provincesData\.provinces\.map\(\(province: any, i\) => \{.*?(</g>| \);)\s*\}\)\}', re.DOTALL)

new_prov_layer = """
              {belgiumProvincesGeo.features.map((feature: any, i: number) => {
                const provId = feature.id;
                const rawProvName = feature.properties.name;
                const provName = translateName(rawProvName, activeLang);
                
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

                const centroid = pathGenerator.centroid(feature);
                const shouldShowLabel = showProvinces && ((!interactiveMode && showLabels) || isWrong || clickedItem === provId || isTheCorrectOne);

                return (
                  <g key={`be-prov-grp-${i}`}>
                    <path
                      d={pathGenerator(feature) || ''}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1"
                      className={`transition-colors duration-155 ${showProvinces ? 'cursor-pointer' : 'pointer-events-none'}`}
                      onMouseEnter={showProvinces ? () => setHoveredItem(provId) : undefined}
                      onMouseLeave={showProvinces ? () => setHoveredItem(null) : undefined}
                      onClick={showProvinces ? (e) => handleEntityClick(provId, provName, e) : undefined}
                    />
                    {shouldShowLabel && centroid && !isNaN(centroid[0]) && provId !== 'be-p-bru' && (
                      <g transform={`translate(${centroid[0]}, ${centroid[1]}) scale(${1 / zoomScale})`}>
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '3px', strokeLinejoin: 'round' }}
                          className="text-[12px] font-sans font-extrabold fill-slate-900 pointer-events-none"
                        >
                          {provName}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
"""

# Replace the provinces mapping logic
content = re.sub(
    r'\{provincesData\.provinces\.map\(\(province: any, i\) => \{.*?(?=\n\s*</g>\n\s*\{/\* Render Brussels)', 
    new_prov_layer, 
    content,
    flags=re.DOTALL
)

# Remove Brussels Enclave Layer since it's now included in belgiumProvincesGeo (id = be-p-bru)
content = re.sub(
    r'\{/\* Render Brussels Enclave Layer \*/\}.*?(?=\n\s*</g>\s*\{/\* Rivers)', 
    '', 
    content,
    flags=re.DOTALL
)
# Wait, let's just make it replace cleanly
# Brussels Enclave starts from {provincesData as any).brussels ... to })()}
content = re.sub(
    r'\{/\* Render Brussels Enclave Layer \*/\}.*?\}\)\(\)\}', 
    '', 
    content,
    flags=re.DOTALL
)


with open('src/components/BelgiumMap.tsx', 'w') as f:
    f.write(content)

