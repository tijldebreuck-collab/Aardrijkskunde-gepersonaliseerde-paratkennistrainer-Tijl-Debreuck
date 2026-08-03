with open('server.ts', 'r') as f:
    content = f.read()

# I will find the remaining chunk and remove it
remaining = """    const parsedResponse = JSON.parse(response.text || "{}");
    return res.json({
      advice: sanitizeString(parsedResponse.advice) || "Zet door en herhaal dagelijks!",
      predictedDifficult: Array.isArray(parsedResponse.predictedDifficult) 
        ? parsedResponse.predictedDifficult.map(sanitizeString) 
        : [],
      focusExercise: sanitizeString(parsedResponse.focusExercise) || "flashcard",
      isHeuristic: false
    });
  } catch (error) {
    console.error("Gemini advice API error:", error);
    // Return standard fallback on error, avoid leaking error details
    return res.status(500).json({ success: false, error: "Kon het studieadvies niet laden." });
  }
});"""

content = content.replace(remaining, "")

with open('server.ts', 'w') as f:
    f.write(content)
print("Fixed server.ts")
