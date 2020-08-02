import React, { useState, useEffect } from "react";
import Subcategory from "../Subcategory/";
import AddSubcategoryModal from "../AddSubcategory/";
import { Collapse } from "reactstrap";
import "./index.css";

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
  const arrow = (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="sort-up"
      className="svg-inline--fa fa-sort-up fa-w-10"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width="25px"
      height="25px"
    >
      <path
        fill="currentColor"
        d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"
      ></path>
    </svg>
  );
  const toExpand = () => {
    setOpen(!open);
    if (arrowTranslation === 0) {
      setArrowTranslation(180);
    } else {
      setArrowTranslation(0);
    }
  };
  const change = () => {};
  return (
    <div>
      <div className="top-container category-container">
        <div className="d-flex ml-3 align-items-center">
          <div
            onClick={toExpand}
            style={{ transform: `rotate(${arrowTranslation}deg)` }}
          >
            {arrow}
          </div>
          <div className="mx-2">{categories.name}</div>
          <div className="" style={{ width: "15px" }}>
            {plus}
            {!setSubCatModal || <AddSubcategoryModal />}
          </div>
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

const plus = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="plus-circle"
    class="svg-inline--fa fa-plus-circle fa-w-16"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
    ></path>
  </svg>
);
export default Category;
