import React, { useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import {
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardTitle,
  CardText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

export const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);

  const { addTransaction } = useContext(GlobalContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount
    };

    addTransaction(newTransaction);
  };

  return (
    <Card body style={{ height: "25vh" }}>
      <CardTitle>
        <h3>Add New Transactions</h3>
      </CardTitle>
      <form onSubmit={onSubmit}>
        <InputGroup style={{ margin: "5px" }}>
          <Input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter transaction name..."
          />
        </InputGroup>
        <InputGroup style={{ margin: "5px" }}>
          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount..."
          />
        </InputGroup>
        <Row className="text-center">
          <Button color="success" style={{ margin: "5px" }}>
            Add Transaction
          </Button>
          <Dropdown
            style={{ margin: "5px" }}
            isOpen={dropdownOpen}
            toggle={toggle}
          >
            <DropdownToggle caret>Dropdown</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Header</DropdownItem>
              <DropdownItem>Some Action</DropdownItem>
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Foo Action</DropdownItem>
              <DropdownItem>Bar Action</DropdownItem>
              <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Row>
      </form>
    </Card>
  );
};
