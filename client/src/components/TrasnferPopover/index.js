import React, { useState } from "react";
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  Button,
  Form,
  Input,
  ButtonGroup,
} from "reactstrap";
import CurrencyInput from "../CurrentcyInput";
import "./index.css";

function Transferpopover(props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [amt, setAmt] = useState(0);
  const [account, setAccount] = useState("");
  const toggle = () => {
    setPopoverOpen(!popoverOpen);
  };

  let value = 0;
  const categoriesOptions = props.categories.map((categoryname) => {
    return <option key={value++}> {categoryname} </option>;
  });

  //call transfer function from parents and clean up states
  const cleanup = () => {
    setPopoverOpen(false);
    setAmt(0);
    setAccount("");
  };

  const handleSubmit = (event) => {
    props.transfer(amt, account);
    cleanup();
  };

  return (
    <div>
      <Button
        id={props.name}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        className="clear-button"
      >
        {/* Add code to change display color to red if negative */}
        <span className="text-size">${props.available} </span>
      </Button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target={props.name}
        toggle={toggle}
      >
        <PopoverHeader>Transfer</PopoverHeader>
        <PopoverBody>
          <Form onSubmit={handleSubmit}>
            <CurrencyInput
              value={amt}
              onChange={(event) => setAmt(event.target.value)}
            />
            <Input
              className="my-3"
              type="select"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
            >
              <option disabled defaultValue>
                Choose Account to Transfer to
              </option>
              {categoriesOptions}
            </Input>
            <ButtonGroup>
              <Button
                className="bg-danger mr-3"
                onClick={() => {
                  cleanup();
                  toggle();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-success">
                Transfer
              </Button>
            </ButtonGroup>
          </Form>
        </PopoverBody>
      </Popover>
    </div>
  );
}
export default Transferpopover;
