import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import AddCategoryModal from "../../components/AddCategory/";
import Category from "../../components/Category/";
import Transferpopover from "../../components/TrasnferPopover/";
import CategoriesContext from "../../utils/CategoriesContext";
import { createCategoryAPI, transferAPI } from "../../utils/CategoryAPI";
import { useAppContext } from "../../utils/globalStates/stateProvider";

import "./index.css";
import { TRANSFER_BALANCE } from "../../utils/globalStates/actions";

function Budget() {
  const [showModal, setShowModal] = useState(false);
  const [state, dispatch] = useAppContext();
  const transfer = (amt, fromCatGrp, fromCat, toCatGrp, toCat) => {
    transferAPI(state.user.sessionUUID)
      .then((data) => {
        console.log(data);
        dispatch({ type: TRANSFER_BALANCE });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //TODO do I want to put this in the store?
  const [categoryGroups, setCategoryGroup] = useState({
    categoriesName: ["Stocks", "Saving"],
    categoryGroups: [
      {
        uuid: "dkdjk",
        name: "Saving",
        categories: [
          { uuid: "kdjfkdjaj3", name: "Stocks", budgeted: 500, spent: 0 },
          { uuid: "kdjkjjih", name: "Vacation", budgeted: 500, spent: 100 },
        ],
      },
      {
        uuid: "idijsk",
        name: "Ye",
        categories: [
          { uuid: "dkjkdjsa", name: "Stocks", budgeted: 500, spent: 0 },
          { uuid: "jkfjkdjs3", name: "Vacation", budgeted: 500, spent: 100 },
        ],
      },
    ],
    transfer: transfer,
  });

  const categoriesDisplay = categoryGroups.categoryGroups.map(
    (categoryGroup) => {
      return (
        <Category key={categoryGroup.uuid} categoryGroup={categoryGroup} />
      );
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
    createCategoryAPI(
      state.user.sessionUUID,
      name,
      "perspective",
      "subCategory Array"
    ).then((res) => {
      console.log(res);
      //TODO reload or add to the store if success
    });
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
          <Button onClick={toggle} className="btn-color  add-cat-group-btn">
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
        <div className="tobe-budgeted-container py-2 shadow">
          <p className="text-budgeted mr-5  ">To be budgeted: </p>
          <Transferpopover
            uuid={"toBeBudgeted"}
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
