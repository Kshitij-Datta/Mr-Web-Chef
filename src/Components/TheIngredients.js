export function TheIngredients(props) {
  const ingredientsListItems = props.ingredients.map((ingredient, index) => (
    <li key={`${ingredient}-${index}`} className="ingredient-item">
      <span>{ingredient}</span>
      <button
        className="remove-btn"
        onClick={() => props.removeIngredient(index)}
        aria-label={`Remove ${ingredient}`}
      >
        ×
      </button>
    </li>
  ));

  return (
    <>
      <h3 id="inHand">Ingredients inhand:</h3>
      <ul>{ingredientsListItems}</ul>
      {props.ingredients.length < 4 && (
        <p className="min-note">(At least 4 items required)</p>
      )}
      {props.ingredients.length >= 4 && (
        <div className="ready-recipe-container">
          <div>
            <h3>Ready for a recipe</h3>
            <p>Generate a recipe from your list of ingredients</p>
          </div>
          <button onClick={props.getRecipe}>Get a recipe</button>
        </div>
      )}
    </>
  );
}
