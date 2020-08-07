import React, { useContext } from "react";
import { Row, Col, CardTitle, Card, CardText } from "reactstrap";
import { GlobalContext } from "../../context/GlobalState";

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  return (
    <Card body className="text-center" style={{ height: "25vh" }}>
      <CardTitle>
        <h4>Your Balance</h4>
        <h1>${total}</h1>
      </CardTitle>
      <Row>
        <Col>
          <CardText>
            <h4>Inflow</h4>
            <p className="text-success">{income}</p>
          </CardText>
        </Col>
        <Col>
          <CardText>
            <h4>Outflow</h4>
            <p className="text-danger">{expense}</p>
          </CardText>
        </Col>
      </Row>
    </Card>
  );
};
