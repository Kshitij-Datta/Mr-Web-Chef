import { useState } from "react";
import { TheIngredients } from "./TheIngredients";
import { GenerateRecipe } from "./GenerateRecipe";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);

  function removeIngredient(index) {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index),
    );
  }

  const [recipeMarkdown, setRecipeMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function getRecipe() {
    setIsLoading(true);
    setRecipeMarkdown(""); // Clear previous recipe
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredients }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await res.json();
      setRecipeMarkdown(data.recipe);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setRecipeMarkdown("Sorry, there was an error generating your recipe.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleInput(event) {
    event.preventDefault();
    const inputValue = new FormData(event.currentTarget);
    const newIngredient = inputValue.get("ingredient").trim();

    if (!newIngredient) return;
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    event.currentTarget.reset();
  }

  return (
    <main className="main-content">
      <form className="inputProducts" onSubmit={handleInput}>
        <input
          type="text"
          placeholder="eg. oregano"
          aria-label="Add Ingredient"
          name="ingredient"
        />
        <button>+ Add Item</button>
      </form>

      {ingredients.length > 0 && (
        <TheIngredients
          getRecipe={getRecipe}
          ingredients={ingredients}
          removeIngredient={removeIngredient}
        />
      )}

      {isLoading && <p className="loading-text">Cooking up your recipe...</p>}
      {!isLoading && recipeMarkdown && (
        <GenerateRecipe recipe={recipeMarkdown} />
      )}
    </main>
  );
}
