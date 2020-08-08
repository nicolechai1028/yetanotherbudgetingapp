import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import AddCategoryModal from "../../components/AddCategory/";
import Category from "../../components/Category/";
import Transferpopover from "../../components/TrasnferPopover/";
import { BudgetAPI } from "../../utils/API";
import CategoriesContext from "../../utils/CategoriesContext";

import "./index.css";

function Budget() {
  const [showModal, setShowModal] = useState(false);
  const transfer = (amt, fromCatGrp, fromCat, toCatGrp, toCat) => {};
  console.log("here budget");
  const [categoryGroups, setCategoryGroup] = useState({
    categoriesName: ["Stocks", "Saving"],
    categoryGroups: [
      {
        id: 1,
        name: "Saving",
        categories: [
          { id: 1, name: "Stocks", budgeted: 500, spent: 0 },
          { id: 2, name: "Vacation", budgeted: 500, spent: 100 },
        ],
      },
      {
        id: 2,
        name: "Saving",
        categories: [
          { id: 1, name: "Stocks", budgeted: 500, spent: 0 },
          { id: 2, name: "Vacation", budgeted: 500, spent: 100 },
        ],
      },
    ],
    transfer: transfer,
  });

  const categoriesDisplay = categoryGroups.categoryGroups.map(
    (categoryGroup) => {
      return <Category key={categoryGroup.id} categoryGroup={categoryGroup} />;
    }
  );
  useEffect(() => {
    //Call API and set categoriesState as value
  });
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
  //used to added from the top not budgeted amount
  const noBudgetedToCategory = (amt, toCatGrp, toCat) => {
    //Transfer from ToBeBudgedted Account to
    transfer(amt, 1, "totalBudgeted", toCatGrp, toCat);
  };
  return (
    <div className="page-container ">
      <div className="sub-container">
        <div className="align-items-center mx-5">
          <Button onClick={toggle} className="bg-success ">
            Add Category Group
          </Button>
          <AddCategoryModal
            text="Add Category Group"
            label="New Category Group"
            showModal={showModal}
            toggle={toggle}
            handleSubmit={addCategoryGroup}
          />
        </div>
        <div className="tobe-budgeted-container py-2">
          <p className="text-p mr-5 d ">To be budgeted: </p>
          <Transferpopover
            name={"toBeBudgeted"}
            categories={categoryGroups.categoriesName}
            available={toBeBudgeted}
            transfer={noBudgetedToCategory}
            className=""
          />
        </div>
      </div>
      <div className="top-container">
        <div className="name-item "> Category Name </div>
        <div className="column-name"> Budgeted </div>
        <div className="column-name"> Spent </div>
        <div className="column-name"> Available </div>
      </div>
      <CategoriesContext.Provider value={{ ...categoryGroups, transfer }}>
        {categoriesDisplay}
      </CategoriesContext.Provider>
    </div>
  );
}

export default Budget;
