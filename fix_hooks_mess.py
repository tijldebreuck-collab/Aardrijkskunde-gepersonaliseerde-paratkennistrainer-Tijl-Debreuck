import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

mess_regex = r'  const zoomRef = useRef<any>\(null\);\s*useEffect\(\(\) => \{.*?\}, \[\]\);\s*const handleZoomIn = \(\) => \{.*?\};\s*const handleZoomOut = \(\) => \{.*?\};\s*'

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Find the FIRST occurrence which is the correct one (at component top level)
    # Actually, let's just remove ALL occurrences and then insert exactly ONE at the top level
    
    # We can remove all of them
    content = re.sub(mess_regex, '', content, flags=re.DOTALL)
    
    # Now insert ONE before the final return (
    zoom_effect = """
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
    # Insert it right before the first return (
    # We can match `  return (\n    <div className="space-y-4">`
    content = re.sub(
        r'(  return \(\n\s*<div className="space-y-4">)',
        zoom_effect + r'\1',
        content,
        count=1
    )
    
    # Wait, in BelgiumMap, does it have `className="space-y-4"`?
    # Let's verify for each file

    with open(filename, 'w') as f:
        f.write(content)

print("Fixed hooks")
