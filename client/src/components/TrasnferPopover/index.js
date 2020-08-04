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

function Transferpopover(props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [amt, setAmt] = useState(0);
  const [account, setAccount] = useState("");
  const toggle = () => setPopoverOpen(!popoverOpen);
  let value = 0;
  const categoriesOptions = props.categories.map((categoryname) => {
    return <option key={value++}> {categoryname} </option>;
  });
  //call transfer function from parents and clean up states
  const cleanup = () => {
    setAmt(0);
    setAccount("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    props.transfer(amt, account);
    cleanup();
  };

  return (
    <div>
      <Button id="Popover1" type="button">
        $ {props.available}
      </Button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target="Popover1"
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
              type="select"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
            >
              {categoriesOptions}
            </Input>
            <ButtonGroup>
              <Button
                className="bg-danger"
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
