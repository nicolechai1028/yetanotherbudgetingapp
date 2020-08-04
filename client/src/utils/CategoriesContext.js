import React from "react";

const CategoryContext = React.createContext({
  categoriesName: [],
  transfer: () => {},
});

export default CategoryContext;
