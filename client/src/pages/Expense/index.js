import React from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { Balance } from "../../components/Balance";
import TransactionList from "../../components/TList";
import { AddTransaction } from "../../components/AddTransaction";

function Expense() {
  return (
    <Container className="themed-container" fluid={true}>
      <Container>
        <Row>
          <Col sm="4">
            <Balance />
          </Col>
          <Col sm="6" md={{ offset: 2 }}>
            <AddTransaction />
          </Col>
        </Row>
      </Container>
      <TransactionList />
    </Container>
  );
}

export default Expense;
