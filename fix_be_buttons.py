import re
with open('src/components/BelgiumMap.tsx', 'r') as f:
    content = f.read()

button_layer = """
          <button
            onClick={() => setShowMountains(!showMountains)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              showMountains ? 'bg-amber-600/30 border-amber-400 text-amber-200' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⛰️ Bergen
          </button>
"""

content = content.replace("🛣️ Autosnelwegen\n          </button>", "🛣️ Autosnelwegen\n          </button>" + button_layer)

with open('src/components/BelgiumMap.tsx', 'w') as f:
    f.write(content)

