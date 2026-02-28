process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/recipe", async (req, res) => {
  try {
    const { ingredients } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have these ingredients: ${ingredients.join(", ")}. Suggest a recipe.`,
      config: {
        systemInstruction: "You are a chef. Suggest a recipe in Markdown.",
      },
    });
    res.json({ recipe: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
