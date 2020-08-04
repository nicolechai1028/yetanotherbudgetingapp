import React, { useState } from "react";
import { Button } from "reactstrap";

import AddCategoryModal from "../../components/AddCategory/";
import Category from "../../components/Category/";
import Transferpopover from "../../components/TrasnferPopover/";
import "./index.css";

function Budget() {
  const [showModal, setShowModal] = useState(false);
  const [popOverShown, setPopOverShown] = useState(false);
  const categories = ["Stocks", "Saving"];
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

  //TEMP VALUE NEED TO CHANGE AFTER INTEGRATE TO BACKEND
  let toBeBudgeted = 0;
  const toggle = () => {
    setShowModal(!showModal);
  };
  const addCategoryGroup = (name) => {
    //do something and make popup
    setShowModal(false);

    console.log(name);
  };
  const transfer = (amt, from, to) => {};
  const noBudgetedToCategory = (amt, account) => {
    //Transfer from ToBeBudgedted Account to
    transfer(amt, "totalBudgeted", account);
  };
  return (
    <div className="page-container ">
      <div className="sub-container ">
        <div className="align-items-center">
          <Button onClick={toggle}>Add Category Group </Button>
          <AddCategoryModal
            text="Add Category Group"
            label="New Category Group"
            showModal={showModal}
            toggle={toggle}
            handleSubmit={addCategoryGroup}
          />
        </div>
        <div className="tobe-budgeted-container d-flex justify-content-center py-2">
          <p className="text-bold text-white mr-5">To be budgeted </p>
          <Transferpopover
            name={"toBeBudgeted"}
            categories={categories}
            available={toBeBudgeted}
            transfer={noBudgetedToCategory}
          />
        </div>
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
