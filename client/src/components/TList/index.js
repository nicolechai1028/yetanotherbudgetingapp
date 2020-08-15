import React, { useState, useEffect } from "react";
import { Table, Card } from "reactstrap";
import { getTransAPI } from "../../utils/TransactionAPI";
import { useAppContext } from "../../utils/globalStates/stateProvider";
import { ADD_TRANSACTION } from "../../utils/globalStates/actions";
export default function TransactionList(props) {
  const [transactions, setTransactions] = useState([]);
  const accountUUID = "63a9b997-d793-429e-bb93-eb57ae5ade9c";
  const [{ user }, dispatch] = useAppContext();

  useEffect(() => {
    getTransAPI(user.sessionUUID, accountUUID)
      .then((response) => {
        console.log(response);
        setTransactions(response.data.transaction);
        dispatch({ type: ADD_TRANSACTION, payload: response.data.transaction });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, props.change, user.sessionUUID]);
  const renderHeader = () => {
    let headerElement = ["date", "payee", "category", "subcategory", "amount"];

    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    return transactions?.map(
      ({ payee, categoryName, subCategoryName, amount }) => {
        return (
          <tr>
            <td>{Intl.DateTimeFormat("en-US").format(props.date)}</td>
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
