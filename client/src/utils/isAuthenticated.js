import React from "react";
import { useAppContext } from "./globalStates/stateProvider";

const isAuthenticated = () => {
  const [state] = useAppContext();

  return state.user ? true : false;
};
