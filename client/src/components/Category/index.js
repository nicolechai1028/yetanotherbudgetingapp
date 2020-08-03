import React, { useState, useEffect } from "react";
import Subcategory from "../Subcategory/";
import { Collapse } from "reactstrap";
import "./index.css";
import AddCategoryModal from "../AddCategory";
import Arrow from "../../icons/Arrow";
import Add from "../../icons/Add";

function Category() {
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [spentTotal, setSpentTotal] = useState(0);
  const [availableTotal, setAvailableTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [subCatModal, setSubCatModal] = useState(false);
  const [arrowTranslation, setArrowTranslation] = useState(0);
  const categories = {
    name: "Saving",
    subcategories: [
      { id: 1, name: "Stocks", budgeted: 500, spent: 0 },
      { id: 2, name: "Vacation", budgeted: 500, spent: 100 },
    ],
  };
  const [showModal, setShowModal] = useState(false);
  const updateBudgeted = (subcategoryName, value) => {
    //change budgeted amount of the subcategory, recalculate available in the higher category

    console.log("Category updating ", subcategoryName + " " + value);
  };
  /* useEffect(() => {
    let temptBudgeted = 0;
    let temptSpent = 0;
    let temptAvailable = 0;
    const tempCat = categories.subcategories.map(
      ({ name, budgeted, spent, id }) => {
        const available = budgeted - spent;
        temptBudgeted += budgeted;
        temptSpent += spent;
        temptAvailable += available;
        return (
          <Subcategory
            key={id}
            name={name}
            budgeted={budgeted}
            spent={spent}
            available={available}
            updateBudgeted={updateBudgeted}
          />
        );
      }
    );
    //setSubcategries(tempCat);
    setAvailableTotal(temptAvailable);
    setSpentTotal(temptSpent);
    setTotalBudgeted(temptBudgeted);
	}, [categories.subcategories, subcategories]); */
  const subcategories = categories.subcategories.map(
    ({ name, budgeted, spent, id }) => {
      const available = budgeted - spent;
      return (
        <Subcategory
          key={id}
          name={name}
          budgeted={budgeted}
          spent={spent}
          available={available}
          updateBudgeted={updateBudgeted}
        />
      );
    }
  );
  const toExpand = () => {
    setOpen(!open);
    if (arrowTranslation === 0) {
      setArrowTranslation(180);
    } else {
      setArrowTranslation(0);
    }
  };
  const toggle = () => {
    setShowModal(!showModal);
  };
  const addSubCategory = (name) => {
    setShowModal(false);
    console.log(name);
  };
  return (
    <div>
      <AddCategoryModal showModal={subCatModal} />
      <div className="top-container category-container">
        <div className="d-flex ml-3 align-items-center">
          <div
            onClick={toExpand}
            style={{
              width: "20px",
              transform: `rotate(${arrowTranslation}deg)`,
            }}
          >
            <Arrow />
          </div>
          <div className="mx-2">{categories.name}</div>
          <div onClick={toggle} style={{ width: "20px" }}>
            <Add />
          </div>
          <AddCategoryModal
            handleSubmit={addSubCategory}
            label="New Category"
            text="Add Category Name"
            showModal={showModal}
            toggle={toggle}
          />
        </div>
        <div className="justify-self-center"> {totalBudgeted} </div>
        <div className="justify-self-center"> {spentTotal} </div>
        <div className="justify-self-center"> {availableTotal} </div>
      </div>

      <Collapse isOpen={open}>
        <div>{subcategories}</div>
      </Collapse>
    </div>
  );
}
export default Category;
