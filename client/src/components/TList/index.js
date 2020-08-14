import React, { useContext, useState, useEffect } from "react";
import { Transaction } from "../../components/Transaction";
import { Table, Card, Container } from "reactstrap";
import { getTransAPI } from "../../utils/TransactionAPI";

export default function TransactionList() {
  const [transactions, setTransactions] = useState();

  const fetchData = e => {
    e.preventDefault();

    getTransAPI
      .getData()
      .then(response => {
        setTransactions(response.data);
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderHeader = () => {
    let headerElement = [
      "date",
      "payee",
      "category",
      "subcategory",
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
      transactions.map(
        ({
          date,
          payee,
          categoryName,
          subCategoryName,
          perspective,
          amount
        }) => {
          return (
            <tr>
              <td>{date}</td>
              <td>{payee}</td>
              <td>{categoryName}</td>
              <td>{subCategoryName}</td>
              <td>{perspective}</td>
              <td>{amount}</td>
            </tr>
          );
        }
      )
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
