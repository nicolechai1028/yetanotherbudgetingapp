import React, { useReducer, useContext, createContext } from "react";
import { TRANSFER_BALANCE, ADD_USER_INFO, RE_AUTHENTICATE } from "./actions";

const AppContext = createContext({});
const { Provider } = AppContext;

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case TRANSFER_BALANCE:
      return { ...state };
    case ADD_USER_INFO: {
      //set user in session storage
      return { ...state, user: { ...action.payload }, loading: false };
    }
    default:
      throw new Error("Error in reducer.");
  }
};

const UserProvider = ({ value = {}, ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { UserProvider, useAppContext };
