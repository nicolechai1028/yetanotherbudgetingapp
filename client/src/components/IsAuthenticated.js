import React from "react";
import { BrowserRouter as Route, Redirect } from "react-router-dom";

import { useAppContext } from "../utils/globalStates/stateProvider";
import Overview from "../components/overviewinfo/ovinfo";
import Budget from "../pages/Budget/";
function IsAuthenciated() {
  const [state, dispatch] = useAppContext();

  return (
    <React.Fragment>
      {state.user ? (
        <React.Fragment>
          <Route
            exact
            path="/overview"
            component={() => <Overview header={"YABA"} />}
          />
          <Route exact path="/budget" component={Budget} />{" "}
        </React.Fragment>
      ) : (
        <Redirect to="/login" />
      )}
    </React.Fragment>
  );
}

export default IsAuthenciated;
