import React, { useState } from "react";
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  ButtonGroup,
} from "reactstrap";
import { Link } from "react-router-dom";

const Navigation = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar
      className="border border-dark rounded"
      color="light"
      expand="md"
      style={{
        paddingLeft: "50px",
      }}
    >
      <NavbarBrand href="/">Y.A.B.A</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar>
          <NavLink tag={Link} style={{ padding: ".5rem" }} to="/overview">
            <Button outline color="success">
              Overview
            </Button>
          </NavLink>
          <NavLink tag={Link} style={{ padding: ".5rem" }} to="/budget">
            <Button outline color="success">
              Budget
            </Button>
          </NavLink>

          <NavItem tag={Link} to="/expense" style={{ padding: ".5rem" }}>
            <Button outline color="success">
              Expense
            </Button>
          </NavItem>
          <NavItem
            tag={Link}
            to="/login"
            style={{ padding: ".5rem", position: "absolute", right: "3%" }}
          >
            <Button style={{ marginRight: "1rem" }} color="info">
              Login
            </Button>
          </NavItem>
          <NavItem tag={Link} to="/signup">
            <Button style={{ marginRight: "1rem" }} color="info">
              Sign Up
            </Button>
          </NavItem>
          {/*TODO Need to do call API*/}
          <NavItem tag={Link} to="/logout">
            <Button color="danger">LogOut</Button>{" "}
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Navigation;
