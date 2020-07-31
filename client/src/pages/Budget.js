import React from "react";
import Button from "react-bootstrap/Button";
function Budget() {
  return (
    <div>
      <div>
        <Button>Add Category Group </Button>
      </div>
      <div className="">
        <p> Category Name</p>
        <p> Budgeted </p>
        <p> Spent</p>
        <p> Available</p>
      </div>
    </div>
  );
}

export default Budget;
