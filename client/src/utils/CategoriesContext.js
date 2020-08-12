import React from "react";

const CategoriesContext = React.createContext({
  categoriesName: [],
  categories: {},
  transfer: () => {},
});

export default CategoriesContext;
