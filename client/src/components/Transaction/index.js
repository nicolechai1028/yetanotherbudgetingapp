import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { Button } from "reactstrap";

export const Transaction = ({ transaction }) => {
  const { deleteTransaction } = useContext(GlobalContext);

  const sign = transaction.amount < 0 ? "-" : "+";

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}{" "}
      <span>
        {sign}${Math.abs(transaction.amount)}
      </span>
      <Button
        style={{ margin: "3px" }}
        color="danger"
        size="sm"
        onClick={() => deleteTransaction(transaction.id)}
        className="delete-btn"
      ></Button>
    </li>
  );
};
