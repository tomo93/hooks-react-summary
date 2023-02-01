import React, { useCallback, useEffect, useReducer } from "react";
import useHttp from "../../hooks/http";
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

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const { isLoading, error, data, sendRequest, extra, identifier, clear } =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: extra });
    } else if (!isLoading && !error && identifier === "ADD_INGREDIENT") {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...extra } });
    }
  }, [data, extra, identifier, isLoading, error]);

  const addIngredienthandler = useCallback(
    async (ingredient) => {
      sendRequest(
        "https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredienthandler = useCallback(
    async (ingredientId) => {
      sendRequest(
        `https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  /*

  In alternativa a React.memo da applicare al componenente IngredientList si puo usare useMemo() che puo essere utiizzato
  per memoizzare qualsiasi oggetto javascript:

  
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredienthandler}
      ></IngredientList>
    );
  }, [userIngredients, removeIngredienthandler]);

*/
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={isLoading}
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
