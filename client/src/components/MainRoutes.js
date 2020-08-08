import React from "react";
import { BrowserRouter as Switch, Route, Redirect } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget/";
import Login from "../pages/Login/";
import Expense from "../pages/Expense/";
import NavigationBar from "../components/NavigationBar/";

function IsAuthenciated(props) {
  const [state] = useAppContext();
  console.log("props ", props);
  console.log("state", state);
  const a = state.user ? "here" : "nope";
  console.log("a ", a);
  return (
    <Switch>
      <Route path="*" component={NavigationBar} />
      <Route exact path="/login" component={Login} />
      {state.user ? (
        <div>
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/budget" component={Budget} />
          <Route exact path="/expense" component={Expense} />
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </Switch>
  );
}

export default IsAuthenciated;
