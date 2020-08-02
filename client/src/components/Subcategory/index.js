import React, { useState } from "react";
import CurrencyInput from "../CurrentcyInput";
import "./index.css";

function Subcategory(props) {
  const [budgeted, setBudgeted] = useState(props.budgeted);

  const handleChange = () => {
    console.log("changed");
    props.updateBudgeted(props.name, budgeted);
    setBudgeted(budgeted);
  };

  return (
    <div className="top-container ">
      <div className="ml-3 name-item"> {props.name} </div>
      <div className="input-subcat m-auto">
        <CurrencyInput
          value={budgeted}
          onChange={(event) => setBudgeted(event.target.value)}
          onBlur={handleChange}
        />
      </div>
      <div className="justify-self-center"> {props.spent} </div>
      <div className="justify-self-center"> {props.available} </div>
    </div>
  );
}

export default Subcategory;
