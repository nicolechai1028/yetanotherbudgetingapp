import React from "react";
import { InputGroup, InputGroupText, InputGroupAddon, Input } from "reactstrap";

function CurrencyInput(props) {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <Input type="number" step=".01" {...props} />
    </InputGroup>
  );
}

export default CurrencyInput;
