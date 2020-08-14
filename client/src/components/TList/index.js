import React, { useState, useEffect } from "react";
import { Table, Card } from "reactstrap";
import { getTransAPI } from "../../utils/TransactionAPI";
import { useAppContext } from "../../utils/globalStates/stateProvider";

export default function TransactionList(props) {
  const [transactions, setTransactions] = useState([]);
  const accountUUID = "63a9b997-d793-429e-bb93-eb57ae5ade9c";
  const [{ user }] = useAppContext();

  const fetchData = () => {
    getTransAPI(user.sessionUUID, accountUUID)
      .then(response => {
        setTransactions(response.data.transaction);
        console.log("response", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [props.change]);
  const renderHeader = () => {
    let headerElement = ["date", "payee", "category", "subcategory", "amount"];

    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    console.log("trans", transactions);

    return transactions?.map(
      ({ date, payee, categoryName, subCategoryName, amount }) => {
        return (
          <tr>
            <td>{date}</td>
            <td>{payee}</td>
            <td>{categoryName}</td>
            <td>{subCategoryName}</td>
            <td> ${amount}</td>
          </tr>
        );
      }
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
