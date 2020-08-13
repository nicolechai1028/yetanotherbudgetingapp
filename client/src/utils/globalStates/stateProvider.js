import React, { useReducer, useContext, createContext } from "react";

import {
  ADD_USER_INFO,
  CHECK_USER_INFO,
  REMOVE_USER,
  SET_LOADING,
  ADD_CATEGORY,
  ADD_TRANSACTION,
} from "./actions";
import { createCategoryAPI } from "../CategoryAPI";

const AppContext = createContext({});
const { Provider } = AppContext;

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_USER_INFO:
      //store user info in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      console.log(action.payload);
      return { ...state, user: { ...action.payload }, loading: false };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case REMOVE_USER:
      const newState = { ...state };
      delete newState.user;
      return { ...newState, loading: false };
    case CHECK_USER_INFO:
      return { ...state };
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case ADD_CATEGORY:
      const { perspective, newName, sessionUUID } = action.payload;
      createCategoryAPI(sessionUUID, newName, perspective, []).then((data) => {
        if (data.status === "OK") {
          return {
            ...state,
            categories: [...state.categories, action.payload],
          };
        }
      });
      break;
    default:
      throw new Error("Error in reducer.");
  }
};

const UserProvider = ({ value = {}, ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loading: false,
    categories: [],
    transactions: [],
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { UserProvider, useAppContext };
