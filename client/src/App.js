import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login/";
import Register from "./pages/Register/";
import Budget from "./pages/Budget";
import Overview from "./pages/Overview";

function App() {
  return (
    <div className="main-container">
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route
            exact
            path="/overview"
            component={() => <Overview header={"YABA"} />}
          />
          <Route exact path="/budget" component={Budget} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
