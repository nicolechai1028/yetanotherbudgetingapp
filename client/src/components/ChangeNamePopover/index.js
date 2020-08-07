import React, { useState } from "react";
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  Form,
  ButtonGroup,
  Button,
  Input,
} from "reactstrap";
import "./index.css";

function ChangeNamePopover(props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newName, setNewName] = useState(props.currentName);
  const toggle = () => {
    setPopoverOpen(!popoverOpen);
  };
  //call transfer function from parents and clean up states
  const cleanup = () => {
    setPopoverOpen(false);
    setNewName("");
  };

  const handleSubmit = (event) => {
    if (newName !== props.currentName) {
      //Dosomething
    }
    cleanup();
  };

  return (
    <div>
      <button
        className="clear-button d"
        id={props.currentName}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        <span className="">{props.currentName} </span>
      </button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target={props.currentName}
        toggle={toggle}
      >
        <PopoverHeader>Transfer</PopoverHeader>
        <PopoverBody>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder={props.currentName}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
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

export default ChangeNamePopover;
