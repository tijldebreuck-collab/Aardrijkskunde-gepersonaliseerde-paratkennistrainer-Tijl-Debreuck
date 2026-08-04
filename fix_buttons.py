import re
with open('src/components/layout/MyLearningContent.tsx', 'r') as f:
    content = f.read()

btn1 = """
                            <button
                              onClick={() => startFolderQuiz(folder.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 ml-2"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              Start
                            </button>"""

btn2 = """
                            <button
                              onClick={() => { updatePreferences({ activeFolderId: folder.id }); onStartQuiz(folder.id, 'multiple-choice'); }}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-500/20 ml-2 text-xs"
                              title="Meerkeuze Quiz"
                            >
                              <HelpCircle className="w-4 h-4" />
                              Meerkeuze
                            </button>
                            <button
                              onClick={() => { updatePreferences({ activeFolderId: folder.id }); onStartQuiz(folder.id, 'map'); }}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 ml-2 text-xs"
                              title="Kaart Quiz"
                            >
                              <Map className="w-4 h-4" />
                              Kaart
                            </button>"""

# Wait, the signature of onStartQuiz needs to be updated.
content = content.replace("onStartQuiz: (folderId?: string) => void;", "onStartQuiz: (folderId?: string, quizMode?: 'multiple-choice' | 'map') => void;")
content = content.replace("import { X, Play, Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check } from 'lucide-react';", "import { X, Play, Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check, Map, HelpCircle } from 'lucide-react';")

# replace the start button.
# Note: startFolderQuiz is a local function. Let's just remove it and use inline onClicks.
content = content.replace(btn1, btn2)

with open('src/components/layout/MyLearningContent.tsx', 'w') as f:
    f.write(content)

