import { useState } from "react";
import { Refrigerator } from "lucide-react"; // [1] Add this import
import { TheIngredients } from "./TheIngredients";
import { GenerateRecipe } from "./GenerateRecipe";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);

  const [recipeMarkdown, setRecipeMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function removeIngredient(index) {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index),
    );
  }

  async function getRecipe() {
    setIsLoading(true);
    setRecipeMarkdown("");
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

      {ingredients.length === 0 && !recipeMarkdown && !isLoading && (
        <div className="empty-state">
          <Refrigerator size={80} strokeWidth={1} color="#ccc" />
          <p>What's in your fridge?</p>
          <span>Add at least 4 ingredients to get a custom recipe.</span>
        </div>
      )}

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
