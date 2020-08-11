import React, { useState, useEffect } from "react";
import Subcategory from "../Subcategory/";
import { Collapse } from "reactstrap";
import "./index.css";
import AddCategoryModal from "../AddCategory";
import Arrow from "../../icons/Arrow";
import Add from "../../icons/Add";
import ChangeNamePopover from "../ChangeNamePopover";

function Category(props) {
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [spentTotal, setSpentTotal] = useState(0);
  const [availableTotal, setAvailableTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [arrowTranslation, setArrowTranslation] = useState(90);

  const [showModal, setShowModal] = useState(false);
  const updateBudgeted = (subcategoryName, value) => {
    //change budgeted amount of the subcategory, recalculate value in teh category group

    console.log("Category updating ", subcategoryName + " " + value);
  };

  const subcategories = props.categoryGroup.categories.map(
    ({ name, budgeted, spent, uuid }) => {
      const available = budgeted - spent;
      return (
        <Subcategory
          key={uuid}
          uuid={uuid}
          name={name}
          budgeted={budgeted}
          spent={spent}
          available={available}
          updateBudgeted={updateBudgeted}
        />
      );
    }
  );

  //handle un/collapse of subcategories div and rotating arrow
  const toExpand = () => {
    setOpen(!open);
    if (arrowTranslation === 90) {
      setArrowTranslation(180);
    } else {
      setArrowTranslation(90);
    }
  };
  const toggle = () => {
    setShowModal(!showModal);
  };
  /*handle add category */
  const addCategory = (name) => {
    //hide modal
    setShowModal(false);
    //Call another function or API to add category name
  };
  return (
    <div>
      <div
        onClick={toExpand}
        className="top-container  category-container shadow"
      >
        <div className="d-flex ml-3 align-items-center ">
          {/*Toggle modal to uncollapse/collapse subcategories div */}
          <div
            onClick={toExpand}
            style={{
              width: "20px",
              transform: `rotate(${arrowTranslation}deg)`,
            }}
            className="pointer"
          >
            {/** Arrow SVG icon **/}
            <Arrow />
          </div>
          <div className="mx-2 s">
            <ChangeNamePopover currentName={props.categoryGroup.name} />
          </div>
          {/*Toggle modal to add subcategories*/}
          <div onClick={toggle} style={{ width: "20px" }} className="pointer">
            {/** Add SVG icon **/}
            <Add />
          </div>
          <AddCategoryModal
            handleSubmit={addCategory}
            label="New Category"
            text="Add Category Name"
            showModal={showModal}
            toggle={toggle}
          />
        </div>
        {/*Display total amounts in the category group*/}
        <div className="justify-self-center"> $ {totalBudgeted} </div>
        <div className="justify-self-center"> $ {spentTotal} </div>
        <div className="justify-self-center"> $ {availableTotal} </div>
      </div>

      <Collapse isOpen={open}>
        <div>{subcategories}</div>
      </Collapse>
    </div>
  );
}
export default Category;
