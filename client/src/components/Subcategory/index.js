import React, { useState } from "react";
import "./index.css";

function Subcategory(props) {
  const [budgeted, setBudgeted] = useState(props.budgeted);

  const handleChange = (event) => {
    console.log(event.target.value);
    setBudgeted(event.target.value);
    props.updateBudgeted(props.name, event.target.value);
  };

  return (
    <div className="d-flex  text-center ml-3 bg-primary category-container ">
      <div className=" mr-auto"> {props.name} </div>
      <div className="d-flex variable-container">
        <div>
          <input
            className="budget-input"
            type="number"
            value={budgeted}
            onChange={handleChange}
          />
        </div>
        <div className=""> {props.spent} </div>
        <div> {props.available} </div>
      </div>
    </div>
  );
}

export default Subcategory;
