import React, { useState } from "react";
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from "reactstrap";

const Navigation = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar
        className="border border-dark rounded"
        color="light"
        expand="md"
        style={{
          margin: "5rem 5rem 5rem 5rem",
          paddingLeft: "30px"
        }}
      >
        <NavbarBrand href="/">{props.header}</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <NavItem style={{ padding: ".5rem" }}>
              <Button outline color="success">
                Budget
              </Button>{" "}
            </NavItem>
            <NavItem style={{ padding: ".5rem" }}>
              <Button outline color="success">
                Expense
              </Button>{" "}
            </NavItem>
            <NavItem style={{ padding: ".5rem" }}>
              <Button color="danger">LogOut</Button>{" "}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
