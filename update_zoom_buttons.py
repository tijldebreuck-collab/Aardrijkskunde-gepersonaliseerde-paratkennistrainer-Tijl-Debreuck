import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Find the useEffect for zoom and replace it to store zoomRef
    zoom_effect_replacement = """
  const zoomRef = useRef<any>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (e) => {
        svg.select("g#map-zoom-group").attr("transform", e.transform as string);
      });
    zoomRef.current = zoom;
    svg.call(zoom);
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
"""

    # First remove the old useEffect
    content = re.sub(
        r'  useEffect\(\(\) => \{\n    if \(\!svgRef\.current\) return;\n    const svg = d3\.select\(svgRef\.current\);\n    const zoom = d3\.zoom<SVGSVGElement, unknown>\(\)\n      \.scaleExtent\(\[1, 8\]\)\n      \.on\("zoom", \(e\) => \{\n        svg\.select\("g#map-zoom-group"\)\.attr\("transform", e\.transform as string\);\n      \}\);\n    svg\.call\(zoom\);\n  \}, \[\]\);\n',
        '',
        content
    )
    
    # Add new block before return
    content = re.sub(
        r'(\s*return \()',
        zoom_effect_replacement + r'\1',
        content
    )

    # Add the buttons to the UI. The SVG container is <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
    # So we can just put a div with absolute positioning inside that.
    buttons = """
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-xl font-bold cursor-pointer transition-all">+</button>
            <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-xl font-bold cursor-pointer transition-all">-</button>
        </div>
"""

    content = re.sub(
        r'(<svg\s+ref=\{svgRef\})',
        buttons + r'\n        \1',
        content
    )

    with open(filename, 'w') as f:
        f.write(content)
print("Updated zoom buttons")
