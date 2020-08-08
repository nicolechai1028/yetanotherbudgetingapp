import React, { useEffect } from "react";
import { BrowserRouter as Switch, Route, Redirect } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget/";
import Login from "../pages/Login/";
import Expense from "../pages/Expense/";
import NavigationBar from "../components/NavigationBar/";
import Expenses from "../pages/Expense/";
import Register from "../pages/Register/";
import Home from "../pages/Home/";

function MainRoutes(props) {
  //useEffect hook load user data from session storaeg;
  //send dispatch to add user_info
  const [state] = useAppContext();
  return (
    <Switch>
      <Route path="*" component={NavigationBar} />
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />

      {state.user && !state.loading ? (
        <div>
          <Route exact path="/expense" component={Expenses} />
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

export default MainRoutes;
