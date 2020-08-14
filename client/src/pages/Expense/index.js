import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Balance } from "../../components/Balance";
import TransactionList from "../../components/TList";
import { AddTransaction } from "../../components/AddTransaction";

function Expense() {
  const [change, setChange] = useState(false);
  return (
    <Container className="themed-container" fluid={true}>
      <Container>
        <Row>
          <Col sm="4">
            <Balance />
          </Col>
          <Col sm="6" md={{ offset: 2 }}>
            <AddTransaction setChange={() => setChange(!change)} />
          </Col>
        </Row>
      </Container>
      <TransactionList change={change} />
    </Container>
  );
}

export default Expense;
