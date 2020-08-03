import React, { useState } from "react";
import { Input } from "reactstrap";
function AddSubcategoryModal(props) {
  const [newCat, setNewCat] = useState("");
  return (
    <div>
      <Input />
    </div>
  );
}

/*      <FormGroup>
            <Label> Budget Amount</Label>
            <CurrencyInput
              placeholder="0"
              value={budgetedAmount}
              onChange={(event) => setBudgetedAmount(event.target.value)}
            />
          </FormGroup>
					*/

export default AddSubcategoryModal;
