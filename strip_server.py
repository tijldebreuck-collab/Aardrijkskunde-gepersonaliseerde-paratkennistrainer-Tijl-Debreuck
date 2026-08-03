import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove genai import
content = re.sub(r'import\s+\{\s*GoogleGenAI\s*\}\s+from\s+"@google/genai";\n?', '', content)

# Remove the getGeminiClient block
gemini_client_block = r"// Lazy initialization of Gemini as instructed\nlet aiClient: GoogleGenAI \| null = null;.*?return aiClient;\n}"
content = re.sub(gemini_client_block, "", content, flags=re.DOTALL)

# Remove the /api/study-advice route completely
study_advice_block = r"// API endpoint for study advice and learning path prediction.*?\}\);"
content = re.sub(study_advice_block, "", content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)
print("Stripped server.ts")
