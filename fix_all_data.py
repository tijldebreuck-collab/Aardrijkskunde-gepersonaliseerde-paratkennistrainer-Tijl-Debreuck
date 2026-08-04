import re

with open('src/components/layout/MyLearningContent.tsx', 'r') as f:
    content = f.read()

replacement = """const ALL_DATA = {
  belgium: {
    province: (belgiumData as any).provinces || [],
    capital: ((belgiumData as any).provinces || []).filter((p: any) => p.capital || p.hoofdstad),
    river: belgiumRivers,
    highway: belgiumHighways,
    mountain: (belgiumData as any).mountains || []
  },
  europe: {
    country: (europeData as any).countries || [],
    capital: ((europeData as any).countries || []).filter((c: any) => c.capital || c.hoofdstad),
    river: europeRivers,
    mountain: europeMountains,
    sea: (europeData as any).seas || [],
    city: (europeData as any).steden || (europeData as any).cities || []
  },
  world: {
    country: (worldData as any).countries || [],
    capital: ((worldData as any).countries || []).filter((c: any) => c.capital || c.hoofdstad),
    river: worldRivers,
    mountain: worldMountains,
    city: (worldData as any).steden || [],
    ocean: (worldData as any).oceans || [],
    continent: (worldData as any).continents || [],
    line: (worldData as any).referenceLines || []
  }
};
"""

content = re.sub(r'const ALL_DATA = \{.*?^\};', replacement, content, flags=re.DOTALL | re.MULTILINE)

with open('src/components/layout/MyLearningContent.tsx', 'w') as f:
    f.write(content)

