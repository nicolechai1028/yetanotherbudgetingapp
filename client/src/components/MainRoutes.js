import React, { useEffect } from "react";
import { BrowserRouter as Switch, Route, Redirect } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget/";
import Login from "../pages/Login/";
import Expense from "../pages/Expense/";
import NavigationBar from "../components/NavigationBar/";

function IsAuthenciated(props) {
  //useEffect hook load user data from session storaeg;
  //send dispatch to add user_info
  const [state] = useAppContext();
  console.log("props ", props);
  console.log("state", state);
  const a = state.user ? "here" : "nope";
  console.log("a ", a);
  return (
    <Switch>
      <Route path="*" component={NavigationBar} />
      <Route exact path="/login" component={Login} />
      {state.user && !state.loading ? (
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
