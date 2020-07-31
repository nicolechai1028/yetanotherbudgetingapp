import React, { useState, useEffect, useRef } from "react";
import Subcategory from "../Subcategory/";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import "./index.css";

function Category() {
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [spentTotal, setSpentTotal] = useState(0);
  const [availableTotal, setAvailableTotal] = useState(0);
  const subcategoriesContainer = useRef(null);
  const [open, setOpen] = useState(false);
  const categories = {
    name: "Saving",
    subcategories: [
      { id: 1, name: "Stocks", budgeted: 500, spent: 0 },
      { id: 2, name: "Vacation", budgeted: 500, spent: 100 },
    ],
  };

  const updateBudgeted = (subcategoryName, value) => {
    //change budgeted amount of the subcategory, recalculate available in the higher category
    console.log("dd");
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
  };
  const change = () => {};
  return (
    <div>
      <div className="d-flex category-container ">
        <div className="d-flex justify-contents-center">
          <div className="" onClick={toExpand}>
            {arrow}
          </div>
          {categories.name}
        </div>
        <div className="d-flex ml-auto variable-container">
          <div> {totalBudgeted} </div>
          <div> {spentTotal} </div>
          <div> {availableTotal} </div>
        </div>
      </div>
      <Collapse in={open}>
        <div>{subcategories}</div>
      </Collapse>
    </div>
  );
}

export default Category;
