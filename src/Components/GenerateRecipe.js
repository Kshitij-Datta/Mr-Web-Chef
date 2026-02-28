import Markdown from "react-markdown";

export function GenerateRecipe({ recipe }) {
  return (
    <div className="recipe-container">
      <h2>Your Recommended Recipe</h2>
      <div className="markdown-body">
        <Markdown>{recipe}</Markdown>
      </div>
    </div>
  );
}
