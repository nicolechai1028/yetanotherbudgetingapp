import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";

function AddCategoryModal(props) {
  const [newName, setNewName] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleSubmit(newName);
    props.toggle();
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
              onChange={(event) => {
                setNewName(event.target.value);
              }}
              value={newName}
              className="my-3"
            />
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
