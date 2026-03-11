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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/api/recipe", async (req, res) => {
  const { ingredients } = req.body;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Ingredients: ${ingredients.join(", ")}`,
        config: {
          systemInstruction: "You are a chef. Suggest a recipe in Markdown.",
        },
      });

      return res.json({ recipe: response.text });
    } catch (error) {
      console.error(
        `Attempt ${attempt + 1} failed:`,
        error.status || error.message,
      );

      if (attempt === maxRetries) {
        return res.status(503).json({
          error:
            "The AI chef is currently overwhelmed with requests. Please try again in a minute!",
        });
      }

      console.log("Retrying in 2 seconds...");
      await delay(2000);
    }
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
