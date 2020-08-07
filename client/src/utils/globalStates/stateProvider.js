import React, { useReducer, useContext, createContext } from "react";
import { TRANSFER_BALANCE, ADD_USER_INFO, CHECK_USER_INFO, SET_LOADING } from "./actions";

const AppContext = createContext({});
const { Provider } = AppContext;

const reducer = (state, action) => {
  switch (action.type) {
    case TRANSFER_BALANCE:
      return { ...state };
    case ADD_USER_INFO: {
      localStorage.setItem("token", action.payload.sessionUUID);
      return { ...state, user: { ...action.payload }, loading:false };
    }
    case SET_LOADING: {
      return {...state, loading: action.payload}
    }
    case CHECK_USER_INFO: {

    }
    default:
      throw new Error("Error in reducer.");
  }
};

const UserProvider = ({ value = {}, ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loading: false
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { UserProvider, useAppContext };
