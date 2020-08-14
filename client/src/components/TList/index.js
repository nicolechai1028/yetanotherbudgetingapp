import React, { useContext, useState, useEffect } from "react";
import { Transaction } from "../../components/Transaction";
import { Table, Card, Container } from "reactstrap";
import { transactions } from "../../utils/API";
import { useAppContext } from "../../utils/globalStates/stateProvider";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [state, dispatch] = useAppContext();

  useEffect(() => {
    fetch("/api/transaction/list")
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
      });
  }, []);

  const renderHeader = () => {
    let headerElement = [
      "date",
      "payee",
      "category",
      "transaction flow",
      "amount"
    ];

    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    return (
      transactions &&
      transactions.map(({ date, payee, category, perspective, amount }) => {
        return (
          <tr>
            <td>{date}</td>
            <td>{payee}</td>
            <td>{category}</td>
            <td>{perspective}</td>
            <td>{amount}</td>
          </tr>
        );
      })
    );
  };

  return (
    <Container-fluid>
      <Card style={{ marginTop: "1rem" }}>
        <Table bordered>
          <thead>
            <tr>{renderHeader()}</tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </Table>
      </Card>
    </Container-fluid>
  );
}
