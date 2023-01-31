import React, { useCallback, useEffect, useState } from "react";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    async function fetchIngredients() {
      const response = await fetch(
        "https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients.json"
      );

      const data = await response.json();

      const loadedIngredients = [];

      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }

      setIngredients(loadedIngredients);
    }

    fetchIngredients();
  }, []);
*/

  const addIngredienthandler = async (ingredient) => {
    setIsLoading(true);
    const response = await fetch(
      "https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );

    const body = await response.json();

    setIsLoading(false);

    setIngredients((prevState) => [
      ...prevState,
      { id: body.name, ...ingredient },
    ]);
  };

  const removeIngredienthandler = async (ingredientId) => {
    setIsLoading(true);

    const response = await fetch(
      `https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).catch((err) => {
      setError(err.message);
    });

    setIsLoading(false);
    setIngredients((prevState) =>
      prevState.filter((ing) => ing.id !== ingredientId)
    );
  };

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredienthandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
