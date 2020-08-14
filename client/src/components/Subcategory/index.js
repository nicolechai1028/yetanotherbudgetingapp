import React, { useState, useContext, useEffect } from "react";
import CurrencyInput from "../CurrentcyInput";
import Transferpopover from "../../components/TrasnferPopover";
import Categorycontext from "../../utils/CategoriesContext";
import ChangeNamePopover from "../ChangeNamePopover/";
import "./index.css";

function Subcategory(props) {
  const [budgeted, setBudgeted] = useState(props.budgeted);
  const categoriesContext = useContext(Categorycontext);

  const handleChange = () => {
    categoriesContext.updateBudgeted(props.catUUID, props.subCatUUID, budgeted);
  };
  useEffect(() => {
    setBudgeted(props.budgeted);
  }, [props.budgeted]);
  // const transfer = (amount, transferToAcct) => {
  //   categoriesContext.transfer(amount, props.name, transferToAcct);
  // };

  return (
    <div className="top-container  py-0 ml-5 shadow-sm   justify-self-center sub-cat-container">
      <div className="sub-name ">
        <ChangeNamePopover currentName={props.name} />
      </div>
      <div className="input-subcat m-auto">
        <CurrencyInput
          value={budgeted}
          onChange={(event) => setBudgeted(event.target.value)}
          onBlur={handleChange}
        />
      </div>
      <div className="justify-self-center"> $ {props.activity} </div>
      <div className="justify-self-center">
        ${props.available}
        {/*popover used to transfer from one subcat to another  
        <Transferpopover
          uuid={props.uuid}
          name={props.name}
          categories={["Hey", "there"]}
          available={props.available}
        />
				*/}
      </div>
    </div>
  );
}

export default Subcategory;
