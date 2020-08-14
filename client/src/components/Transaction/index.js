import React, { useContext } from "react";
import { Button } from "reactstrap";
import { useAppContext } from "../../utils/globalStates/stateProvider";

export const Transaction = ({ transaction }) => {
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
        className="delete-btn"
      ></Button>
    </li>
  );
};
