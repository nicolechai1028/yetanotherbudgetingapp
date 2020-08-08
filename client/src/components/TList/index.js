import React, { useContext, useState, useEffect } from "react";
import { Transaction } from "../../components/Transaction";
import { Table, Card } from "reactstrap";
import { GlobalContext } from "../../context/GlobalState";
import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/users";

export const TransactionList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await axios.get(URL);
    setEmployees(response.data);
  };

  const removeData = id => {
    axios.delete(`${URL}/${id}`).then(res => {
      const del = employees.filter(employee => id !== employee.id);
      setEmployees(del);
    });
  };

  const renderHeader = () => {
    let headerElement = [
      "date",
      "payee",
      "category",
      "transaction",
      "operation"
    ];

    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    return (
      employees &&
      employees.map(({ id, name, email, phone }) => {
        return (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td className="operation">
              <button className="button" onClick={() => removeData(id)}>
                Delete
              </button>
            </td>
          </tr>
        );
      })
    );
  };

  return (
    <Card style={{ marginTop: "1rem" }}>
      <Table bordered>
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </Table>
    </Card>
  );
};

// {transactions.map(transaction => (
//   <Transaction key={transaction.id} transaction={transaction} />
// ))}

export default TransactionList;
