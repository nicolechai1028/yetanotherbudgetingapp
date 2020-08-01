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
          paddingLeft: "50px"
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
            <NavItem
              style={{ padding: ".5rem", position: "absolute", right: "3%" }}
            >
              <Button style={{ marginRight: "1rem" }} color="info">
                Login
              </Button>{" "}
              <Button style={{ marginRight: "1rem" }} color="info">
                Sign Up
              </Button>{" "}
              <Button color="danger">LogOut</Button>{" "}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
