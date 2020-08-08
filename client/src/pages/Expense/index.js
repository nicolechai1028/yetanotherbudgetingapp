import React from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { Balance } from "../../components/Balance";
import { TransactionList } from "../../components/TList";
import { AddTransaction } from "../../components/AddTransaction";
import { GlobalProvider } from "../../context/GlobalState";

function Expense() {
  return (
    <Container className="themed-container" fluid={true}>
      <GlobalProvider>
        <Container>
          <Row>
            <Col sm="4">
              <Balance />
            </Col>
            <Col sm="6">
              <AddTransaction />
            </Col>
          </Row>
        </Container>
        <TransactionList />
      </GlobalProvider>
    </Container>
  );
}

export default Expense;
