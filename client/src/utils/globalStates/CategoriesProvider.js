import React, { useReducer, useContext, createContext } from "react";
import { TRANSFER_BALANCE } from "./actions";

const CategoriesContext = createContext({});
const { Provider } = CategoriesContext;

const reducer = (state, action) => {
  switch (action.type) {
    case TRANSFER_BALANCE:
      return { ...state };
    default:
      console.log(`No case for ${action.type}`);
      return;
  }
};

const CategoriesProvider = ({ value = {}, ...props }) => {
  const [state, dispatch] = useReducer(reducer, { categories: [] });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useCategoriesContext = () => {
  return useContext(CategoriesContext);
};

export { CategoriesProvider, useCategoriesContext };
