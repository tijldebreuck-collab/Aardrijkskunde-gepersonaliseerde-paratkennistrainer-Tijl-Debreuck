import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove the ai variables
ai_states = """  // Dynamic AI study advisor advice payload state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<{
    advice: string;
    predictedDifficult: string[];
    focusExercise: QuizMode;
  } | null>(null);"""
content = content.replace(ai_states, "")

# 2. Remove loadAIAdviceAndPath
api_load_marker = "  // API load handler for the AI Study advisor coaching recommendation"
useEffect_marker = "  const clearProgressAndStats = () => {"
content = re.sub(re.escape(api_load_marker) + r".*?" + re.escape(useEffect_marker), useEffect_marker, content, flags=re.DOTALL)

# 3. Rename 'advice' tab to something else if needed, but the user said "verwijder ook elke ai feature". The advice tab WAS the AI feature.
# We should probably remove the "Instellingen" nav link, because there are no settings other than "Statistieken" which has the clear stats button.
# Let's check the nav links.
nav_link = r"""          <a href="#" className={`nav-link \$\{activeTab === 'advice' && !isPlaying \? 'active' : ''\}`} onClick=\{\(e\) => \{ e\.preventDefault\(\); quitQuizSession\(\); setActiveTab\('advice'\); \}\}>Instellingen</a>\n"""
content = re.sub(nav_link, "", content)

# 4. Remove the advice tab content
advice_tab = r"""            \{\/\* View Tab AI advice \*\/\}
            \{activeTab === 'advice' && \(
              <div className="max-w-3xl mx-auto space-y-6">.*?<\/div>
            \)\}"""
content = re.sub(advice_tab, "", content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Stripped App.tsx")
