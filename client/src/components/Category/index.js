import React, { useState, useEffect, useContext } from "react";
import Subcategory from "../Subcategory/";
import { Collapse } from "reactstrap";
import "./index.css";
import AddCategoryModal from "../AddCategory";
import Arrow from "../../icons/Arrow";
import Add from "../../icons/Add";
import ChangeNamePopover from "../ChangeNamePopover";
import CategoriesContext from "../../utils/CategoriesContext";

function Category(props) {
  const [budgetedTotal, setBudgetedTotal] = useState(0);
  const [activityTotal, setActivityTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [arrowTranslation, setArrowTranslation] = useState(90);
  const [showModal, setShowModal] = useState(false);
  const categoriesContext = useContext(CategoriesContext);

  let tempbudgeted = 0;
  let tempActivity = 0;

  console.log("subCategory", props.subCategory);
  const subcategories = props.subCategory.map(
    ({ subCategoryName, budgeted, activity, subCategoryUUID }) => {
      const available = budgeted - activity;
      tempbudgeted += budgeted;
      tempActivity += activity;
      return (
        <Subcategory
          key={subCategoryUUID}
          catUUID={props.catUUID}
          subCatUUID={subCategoryUUID}
          name={subCategoryName}
          budgeted={budgeted}
          activity={activity}
          available={available}
        />
      );
    }
  );

  useEffect(() => {
    setBudgetedTotal(tempbudgeted);
  }, [tempbudgeted]);
  useEffect(() => {
    setActivityTotal(tempActivity);
  }, [tempActivity]);

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
  const addCategory = (name, perspective) => {
    //hide modal
    setShowModal(false);
    categoriesContext.addSubCategory(name, props.catUUID);
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
            <ChangeNamePopover
              currentName={props.categoryName}
              catUUID={props.catUUID}
            />
          </div>
          {/*Toggle modal to add subcategories*/}
          <div onClick={toggle} style={{ width: "20px" }} className="pointer">
            {/** Add SVG icon **/}
            <Add />
          </div>
          <AddCategoryModal
            label="New Category"
            text="Add Category Name"
            showModal={showModal}
            toggle={toggle}
            addCategory={addCategory}
          />
        </div>
        {/*Display total amounts in the category group*/}
        <div className="justify-self-center d"> $ {budgetedTotal} </div>
        <div className="justify-self-center"> $ {activityTotal} </div>
        <div className="justify-self-center">
          $ {budgetedTotal - activityTotal}
        </div>
      </div>

      <Collapse isOpen={open}>
        <div>{subcategories}</div>
      </Collapse>
    </div>
  );
}
export default Category;
