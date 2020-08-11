import React, { useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../pages/Overview";
import Budget from "../pages/Budget/";
import Login from "../pages/Login/";
import Expenses from "../pages/Expense/";
import NavigationBar from "../components/NavigationBar/";
import Register from "../pages/Register/";
import Home from "../pages/Home/";
import { ADD_USER_INFO, REMOVE_USER } from "../utils/globalStates/actions";
import { logoutAPI } from "../utils/API";

function MainRoutes(props) {
  const [state, dispatch] = useAppContext();
  useEffect(() => {
    //Check if there is a user in sessionStorage
    const user = sessionStorage.getItem("user");
    if (user) {
      dispatch({ type: ADD_USER_INFO, user: JSON.parse(user), loading: false });
    }
  }, [dispatch]);

  const logout = () => {
    if (state.user.sessionUUID) {
      logoutAPI(state.user.sessionUUID);
      dispatch({ type: REMOVE_USER });
      sessionStorage.removeItem("user");
      return <Redirect to="/" />;
    }
  };

  return (
    <BrowserRouter>
      <NavigationBar />
      <Switch>
        <Route exact path={["", "/"]} component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/logout" component={logout} />

        {state.user && !state.loading ? (
          <div>
            <Route exact path="/expense" component={Expenses} />
            <Route exact path="/overview" component={Overview} />
            <Route exact path="/budget" component={Budget} />
          </div>
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default MainRoutes;
