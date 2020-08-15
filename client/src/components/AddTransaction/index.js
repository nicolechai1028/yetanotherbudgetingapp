import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardTitle,
  FormGroup
} from "reactstrap";
import { ADD_TRANSACTION } from "../../utils/globalStates/actions";
import { useAppContext } from "../../utils/globalStates/stateProvider";
import { getBudgetListAPI } from "../../utils/CategoryAPI";
import CategoriesContext from "../../utils/CategoriesContext";
import { createTransAPI } from "../../utils/TransactionAPI";

export const AddTransaction = props => {
  const [{ user }] = useAppContext();
  const [state, dispatch] = useAppContext();
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCatID, setSubCatID] = useState("");
  const [MainCatID, setMainCatID] = useState("");
  const accountUUID = "63a9b997-d793-429e-bb93-eb57ae5ade9c";
  const [yearMonth] = useState(getMonthFormat());

  useEffect(() => {
    getBudgetListAPI(user.sessionUUID, yearMonth).then(response => {
      console.log(response.data);
      const tempCat = response.data.budget.map(category => {
        const tempSubCat = category.subCategory.map(subCategory => {
          return {
            subCategoryName: subCategory.subCategoryName,
            subCategoryUUID: subCategory.subCategoryUUID
          };
        });
        return {
          categoryName: category.categoryName,
          categoryUUID: category.categoryUUID,
          subCategory: tempSubCat
        };
      });
      setCategories(tempCat);
    });
  }, [user.sessionUUID, yearMonth]);
  console.log(categories);

  const onSubmit = e => {
    e.preventDefault();
    console.log(e.target);

    createTransAPI(
      user.sessionUUID,
      accountUUID,
      payee,
      MainCatID,
      subCatID,
      amount,
      []
    ).then(response => {
      dispatch({
        type: ADD_TRANSACTION,
        payload: response.data.transaction
      });
      console.log(response);
      props.setChange();
    });
  };

  const handleCategorySelect = event => {
    const value = JSON.parse(event.target.value);
    console.log(value);
    setSubCatID(value.subCategoryUUID);
    setMainCatID(value.categoryUUID);
  };

  return (
    <Card body className="compcard">
      <CardTitle className="text-center">
        <h3>Add New Transactions</h3>
      </CardTitle>
      <form onSubmit={onSubmit}>
        <Row>
          <InputGroup style={{ margin: "5px 10px 5px 10px" }}>
            <Input
              type="text"
              value={payee}
              onChange={e => setPayee(e.target.value)}
              placeholder="Enter Payee Name"
            />
            <FormGroup>
              <CategoriesContext.Provider>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  onChange={handleCategorySelect}
                >
                  <option value="" disabled selected hidden>
                    Select a Category
                  </option>

                  {categories.map(category => {
                    return category.subCategory.map(subCategory => {
                      return (
                        <option
                          value={JSON.stringify({
                            subCategoryUUID: subCategory.subCategoryUUID,
                            categoryUUID: category.categoryUUID
                          })}
                        >
                          {subCategory.subCategoryName}
                        </option>
                      );
                    });
                  })}
                </Input>
                {/* {categories.map(category => {
                    return (
                      <React.Fragment>
                        <DropdownItem disabled>
                          {category.categoryName}{" "}
                        </DropdownItem>
                        {category.subCategory.map(subCategory => {
                          return (
                            <DropdownItem
                              onClick={() =>
                                setDdId(subCategory.subCategoryUUID)
                              }
                            >
                              {"\t"}
                              {subCategory.subCategoryName}{" "}
                            </DropdownItem>
                          );
                        })}
                      </React.Fragment>
                    );
                  })} */}
              </CategoriesContext.Provider>
            </FormGroup>
          </InputGroup>
        </Row>
        <Row>
          <InputGroup style={{ margin: "5px 10px 5px 10px" }}>
            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
          </InputGroup>
        </Row>
        <Row className="d-flex justify-content-center">
          <Button color="success" style={{ margin: "3px" }}>
            Add Transaction
          </Button>
        </Row>
      </form>
    </Card>
  );
};

const getMonthFormat = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  return month < 10
    ? `${date.getFullYear()}0${month}`
    : `${date.getFullYear()}${month}`;
};
