import React, { useState } from "react";
import Category from "../../components/Category/";
import "./index.css";
import AddCategoryModal from "../../components/AddCategory/";
import { Button } from "reactstrap";
function Budget() {
  const [showModal, setShowModal] = useState(false);
  const [popOverShown, setPopOverShown] = useState(false);
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

  const addCategoryGroup = (name) => {
    //do something and make popup
    setShowModal(false);

    console.log(name);
  };
  const transfer = () => {};
  return (
    <div className="page-container ">
      <div className="sub-container ">
        <div className="align-items-center">
          <Button onClick={toggle}>Add Category Group </Button>
          {!showModal || (
            <AddCategoryModal
              text="Add Category Group"
              label="New Category Group"
              showModal={showModal}
              toggle={toggle}
              handleSubmit={addCategoryGroup}
            />
          )}
        </div>
        <div className="tobe-budgeted-container"> To be budgeted </div>
      </div>
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
