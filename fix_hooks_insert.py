import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

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

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Find the FIRST occurrence of return (
    # We can do this with re.sub with count=1
    content = re.sub(
        r'(return \(\n\s*<div className="space-y-4">)',
        zoom_effect + r'\1',
        content,
        count=1
    )
    with open(filename, 'w') as f:
        f.write(content)

print("Fixed hooks insert")
