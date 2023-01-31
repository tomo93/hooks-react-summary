import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    async function fetchIngredients() {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        const response = await fetch(
          "https://react-hooks-summary-f9dbb-default-rtdb.firebaseio.com/ingredients.json" +
            query
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

        onLoadIngredients(loadedIngredients);
      }
    }

    const timer = setTimeout(() => {
      fetchIngredients();
    }, 500);

    return () => clearTimeout(timer);
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
