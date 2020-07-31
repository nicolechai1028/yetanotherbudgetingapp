import React from "react";
import Button from "react-bootstrap/Button";
import Category from "../../components/Category/";
import "./index.css";

function Budget() {
  const budgetState = {
    categories: {
      saving: {
        stock: {
          budgeted: 500,
          spent: 500,
        },
      },
      vacation: {
        budgeted: 500,
        spent: 500,
      },
    },
  };
  const addCategory = () => {
    //do something and make popup
  };
  return (
    <div className="m-5 ">
      <Button onClick={addCategory}>Add Category Group </Button>
      <div className="d-flex ">
        <div> Category Name </div>
        <div className="ml-auto amount-container">
          <div> Budgeted </div>
          <div> Spent </div>
          <div> Available </div>
        </div>
      </div>
      <Category />
    </div>
  );
}

export default Budget;
