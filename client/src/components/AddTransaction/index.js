import React, { useState, useContext } from "react";
import {
  Row,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardTitle,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { ADD_TRANSACTION } from "../../utils/globalStates/actions";
import { useAppContext } from "../../utils/globalStates/stateProvider";

export const AddTransaction = () => {
  const [state, dispatch] = useAppContext();
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      payee,
      amount: +amount,
      name: e.target.value
    };

    dispatch({
      type: ADD_TRANSACTION,
      payload: {
        sessionUUID: state.user.sessionUUID,
        payee,
        amount,
        newTransaction
      }
    });
  };

  return (
    <Card body style={{ height: "25vh" }}>
      <CardTitle className="text-center">
        <h3>Add New Transactions</h3>
      </CardTitle>
      <form onSubmit={onSubmit}>
        <Row>
          <InputGroup style={{ margin: "5px 15px 5px 15px" }}>
            <Input
              type="text"
              value={payee}
              onChange={e => setPayee(e.target.value)}
              placeholder="Enter Payee Name"
            />
            <Dropdown
              style={{ marginLeft: "5px" }}
              isOpen={dropdownOpen}
              toggle={toggle}
            >
              <DropdownToggle caret>Dropdown</DropdownToggle>
              <DropdownMenu>
                {state.categories.map(a => (
                  <DropdownItem>{a.newName}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </InputGroup>
        </Row>
        <Row>
          <InputGroup style={{ margin: "5px 15px 5px 15px" }}>
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
