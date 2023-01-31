import React, { useCallback, useEffect, useReducer, useState } from "react";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there");
  }
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currHttpState, loading: false };
    case "ERROR":
      return { error: action.error, loading: false };
    case "CLEAR":
      return { ...currHttpState, error: null };
    default:
      throw new Error("Should not get there");
  }
};
function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  //const [ingredients, setIngredients] = useState([]);

  //const [isLoading, setIsLoading] = useState(false);

  //const [error, setError] = useState(null);

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
    //setIsLoading(true);

    dispatchHttpState({ type: "SEND" });
    const response = await fetch(
      "https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );

    const body = await response.json();

    dispatchHttpState({ type: "RESPONSE" });

    dispatch({ type: "ADD", ingredient: { id: body.name, ...ingredient } });
    /*
    setIngredients((prevState) => [
      ...prevState,
      { id: body.name, ...ingredient },
    ]);
    */
  };

  const removeIngredienthandler = async (ingredientId) => {
    dispatchHttpState({ type: "SEND" });

    const response = await fetch(
      `https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).catch((err) => {
      dispatchHttpState({ type: "ERROR", error: err.message });
    });

    dispatchHttpState({ type: "RESPONSE" });

    dispatch({ type: "DELETE", id: ingredientId });
    /*
        setIngredients((prevState) =>
      prevState.filter((ing) => ing.id !== ingredientId)
    );
    */
  };

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    //setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const clearError = () => {
    dispatchHttpState({ type: "CLEAR" });
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredienthandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
