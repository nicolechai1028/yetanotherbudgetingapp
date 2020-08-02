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
import CurrencyInput from "../CurrentcyInput";

function AddCategoryModal(props) {
  const [newCat, setNewCat] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    //API call to add new Category
    console.log("Cat ", newCat);

    props.toggle();
  };
  const cleanUp = () => {
    setNewCat("");
    props.toggle();
  };
  return (
    <Modal isOpen={props.showModal}>
      <ModalHeader>Add New Category Group</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Category Name</Label>
            <Input
              type="text"
              placeholder="New Category Name"
              onChange={(event) => {
                setNewCat(event.target.value);
              }}
              value={newCat}
            />
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default AddCategoryModal;
