import axios from "axios";

export const createCategoryAPI = (sessionUUID, categoryName, perspective) => {
  return axios.post("/api/category/create", {
    sessionUUID,
    categoryName,
    perspective,
  });
};

export const createSubCategoryAPI = (
  sessionUUID,
  categoryUUID,
  subCategory
) => {
  return axios.post("/api/category/addSubCategory", {
    sessionUUID,
    categoryUUID,
    subCategory: [subCategory],
  });
};
export const getBudgetListAPI = (sessionUUID, yearMonth) => {
  return axios.post("/api/budget/list", { sessionUUID, yearMonth });
};

export const setSubCatBudgetAPI = (
  sessionUUID,
  categoryUUID,
  subCategoryUUID,
  yearMonth,
  budgetedAmount
) => {
  return axios.post("/api/budget/modifyItem", {
    sessionUUID,
    categoryUUID,
    subCategoryUUID,
    yearMonth,
    budgetedAmount,
  });
};
