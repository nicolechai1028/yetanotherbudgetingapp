import React, { useState, useContext } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Label
} from "reactstrap";

import { ADD_CATEGORY } from "../../utils/globalStates/actions";

import { GlobalContext } from "../../context/GlobalState";
import { useAppContext } from "../../utils/globalStates/stateProvider";

const flowKeys = {
  Income: "Inflow",
  Expense: "Outflow"
};

function AddCategoryModal(props) {
  const [state, dispatch] = useAppContext();
  const [newName, setNewName] = useState("");
  const [perspective, setPerspective] = useState("Inflow");

  const handleSelect = e => setPerspective(flowKeys[e.target.value]);
  const handleSubmit = event => {
    event.preventDefault();
    props.handleSubmit(newName);
    props.toggle();
    dispatch({ type: ADD_CATEGORY, payload: { newName, perspective } });
  };
  const cleanUp = () => {
    setNewName("");
    props.toggle();
  };
  return (
    <Modal isOpen={props.showModal}>
      <ModalHeader>Add {props.label}</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{props.label}</Label>
            <Input
              type="text"
              placeholder={props.text}
              onChange={event => {
                setNewName(event.target.value);
              }}
              value={newName}
              className="my-3"
            />
            <FormGroup>
              <Label for="exampleSelectMulti">Select Type</Label>
              <Input
                onChange={handleSelect}
                type="select"
                name="select"
                id="exampleSelectMulti"
              >
                <option>Income</option>
                <option>Expense</option>
              </Input>
            </FormGroup>
          </FormGroup>
          <Button className="mr-3" type="submit">
            Add Category Group
          </Button>
          <Button onClick={cleanUp} className="bg-danger">
            Close
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default AddCategoryModal;
