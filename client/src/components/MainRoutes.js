import React from "react";
import { BrowserRouter as Switch, Route, Redirect } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget/";
import Login from "../pages/Login/";
import NavigationBar from "../components/NavigationBar/";

function IsAuthenciated(props) {
  const [state] = useAppContext();
  return (
    <Switch>
      <Route path="*" component={NavigationBar} />
      <Route exact path="/login" component={Login} />
      {state.user ? (
        <div>
          <Route exact path="/overview" component={Overview} />
          <Route exact path="/budget" component={Budget} />
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </Switch>
  );
}

export default IsAuthenciated;
