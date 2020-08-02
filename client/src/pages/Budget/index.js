import React, { useState } from "react";
import Category from "../../components/Category/";
import "./index.css";
import AddCategoryModal from "../../components/AddCategory/";
import { Button } from "reactstrap";
function Budget() {
  const [showModal, setShowModal] = useState(false);

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
  const toggle = () => {
    setShowModal(!showModal);
  };

  const addCategory = () => {
    //do something and make popup
    setShowModal(true);
  };
  return (
    <div className="page-container ">
      <Button onClick={addCategory}>Add Category Group </Button>
      {!showModal || <AddCategoryModal showModal={showModal} toggle={toggle} />}
      <div className="top-container">
        <div className="name-item font-weight-bold"> Category Name </div>
        <div className="justify-self-center font-weight-bold"> Budgeted </div>
        <div className="justify-self-center font-weight-bold"> Spent </div>
        <div className="justify-self-center font-weight-bold"> Available </div>
      </div>
      <Category />
    </div>
  );
}

export default Budget;
