import React, { useState } from "react";

import Card from "../UI/Card";
import LoadingIndicator from "../UI/LoadingIndicator";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  //const [inputState, setInputState] = useState({ title: "", amount: "" });

  //Oppure stati multipli separati, cosi non ce piu bisogno di fare il merge manualmente
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={(e) => {
                const newtitle = e.target.value;
                /*setInputState((prevState) => ({
                  title: newtitle,
                  amount: prevState.amount,
                }));*/

                setEnteredTitle(newtitle);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={(e) => {
                const newamount = e.target.value;

                setEnteredAmount(newamount);
                /*setInputState((prevState) => ({
                  title: prevState.title,
                  amount: newamount,
                }));*/
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
