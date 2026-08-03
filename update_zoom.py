import re

files = ["src/components/WorldMap.tsx", "src/components/EuropeMap.tsx", "src/components/BelgiumMap.tsx"]

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()

    # Wrap the content in <g id="map-zoom-group">
    # Specifically, after <svg ...> up to </svg>
    content = re.sub(
        r'(<svg\s+ref=\{svgRef\}[^>]*>)',
        r'\1\n          <g id="map-zoom-group">',
        content
    )
    content = re.sub(
        r'(</svg>)',
        r'          </g>\n\1',
        content
    )

    # Add the useEffect for d3 zoom
    zoom_effect = """
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (e) => {
        svg.select("g#map-zoom-group").attr("transform", e.transform as string);
      });
    svg.call(zoom);
  }, []);
"""

    # Insert it before return (
    content = re.sub(
        r'(\s*return \()',
        zoom_effect + r'\1',
        content
    )
    
    with open(filename, 'w') as f:
        f.write(content)
print("Updated zoom")
