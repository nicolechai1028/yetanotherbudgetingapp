import React, { useReducer, useContext, createContext } from "react";
import { TRANSFER_BALANCE, ADD_USER_INFO } from "./actions";

const AppContext = createContext({});
const { Provider } = AppContext;

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case TRANSFER_BALANCE:
      return { ...state };
    case ADD_USER_INFO: {
      return { ...state, user: { ...action.payload } };
    }
    default:
      throw new Error("Error in reducer.");
  }
};

const UserProvider = ({ value = {}, ...props }) => {
  const [state, dispatch] = useReducer(reducer, {});

  return <Provider value={[state, dispatch]} {...props} />;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { UserProvider, useAppContext };
