import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "./utils/globalStates/stateProvider";
import MainRoutes from "./components/MainRoutes";
function App() {
  return (
    <div className="main-container">
      <UserProvider>
        <MainRoutes />
      </UserProvider>
    </div>
  );
}

export default App;
