import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login/";
import Register from "./pages/Register/";
import Overview from "./pages/Overview"
import { UserProvider} from "./utils/globalStates/stateProvider";
import IsAuthenticated from "./components/IsAuthenticated";

function App() {
  return (
    <div className="main-container">
      <Router>
        <UserProvider>
          <NavigationBar />
          <Switch>
            <Route exact path="/overview" component={Overview}/>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            {/*Routes for when use is login if not logged in will redirect login page*/}
            <IsAuthenticated />
          </Switch>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
