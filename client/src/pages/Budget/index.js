import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import CategoriesContext from "../../utils/CategoriesContext";
import AddCategoryModal from "../../components/AddCategory/";
import Category from "../../components/Category/";
import MonthSelector from "../../components/MonthSelector/";
import { useAppContext } from "../../utils/globalStates/stateProvider";
import {
  getBudgetListAPI,
  createCategoryAPI,
  createSubCategoryAPI,
  setSubCatBudgetAPI,
} from "../../utils/CategoryAPI";

import "./index.css";
function Budget() {
  const [showModal, setShowModal] = useState(false);
  const [state] = useAppContext();
  const [categories, setCategories] = useState([]);
  const user = state.user;

  const [yearMonth, setYearMonth] = useState(getMonthFormat());
  //when first load check budget list has been loaded if not load budget list
  //potential issue
  useEffect(() => {
    //Call API and set categoriesState as value
    if (!state.loading) {
      getBudgetListAPI(user.sessionUUID, yearMonth).then((response) => {
        setCategories(response.data.budget);
      });
    }
  }, [setCategories, user.sessionUUID, yearMonth, state.loading]);

  const getList = () => {
    getBudgetListAPI(user.sessionUUID, yearMonth).then((response) => {
      setCategories(response.data.budget);
    });
  };
  const addCategoryGroup = (name, perspective) => {
    createCategoryAPI(user.sessionUUID, name, perspective).then(({ data }) => {
      if (data.status === "OK") {
        getList();
      }
    });
  };

  const addSubCategory = (newSubName, categoryUUID) => {
    createSubCategoryAPI(user.sessionUUID, categoryUUID, newSubName).then(
      ({ data }) => {
        //Will have to update to use useMemo so the entire page does not re-render
        if (data.status === "OK") {
          getList();
        }
      }
    );
  };

  const toggle = () => {
    setShowModal(!showModal);
  };

  const updateBudgeted = (categoryUUID, subCategoryUUID, budgeted) => {
    setSubCatBudgetAPI(
      user.sessionUUID,
      categoryUUID,
      subCategoryUUID,
      yearMonth,
      budgeted
    ).then(({ data }) => {
      console.log("retruned from sertITem", data);
      console.log("current categories", categories);
      getList();
    });
  };

  return (
    <div className="page-container ">
      <div className="sub-container">
        <div className="align-items-center mx-5">
          <Button onClick={toggle} className="btn-color shadow">
            Add Category Group
          </Button>
          <AddCategoryModal
            text="Add Category Group"
            label="New Category Group"
            showModal={showModal}
            toggle={toggle}
            addCategory={addCategoryGroup}
          />
        </div>
        <div>
          <MonthSelector yearMonth={yearMonth} setYearMonth={setYearMonth} />
        </div>
        {/* 
					*** Code be be added when transfer functionality to is to be added
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
						*/}
      </div>
      <div className="top-container">
        <div className="name-item "> Category Name </div>
        <div className="column-name"> Budgeted </div>
        <div className="column-name"> Spent </div>
        <div className="column-name"> Available </div>
      </div>
      <CategoriesContext.Provider value={{ addSubCategory, updateBudgeted }}>
        {categories.map((category) => {
          return (
            <Category
              key={category.categoryUUID}
              catUUID={category.categoryUUID}
              categoryName={category.categoryName}
              subCategory={category.subCategory}
            />
          );
        })}
      </CategoriesContext.Provider>
    </div>
  );
}

const getMonthFormat = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  return month < 10
    ? `${date.getFullYear()}0${month}`
    : `${date.getFullYear()}${month}`;
};
export default Budget;
