import axios from "axios";

export const createCategoryAPI = (
  sessionUUID,
  categoryName,
  subCategory,
  perspective
) => {
  return axios.post("/api/category/create", {
    sessionUUID,
    categoryName,
    perspective,
    subCategory,
  });
};

export const getCategoryListAPI = (sessionUUID, categoryName) => {
  return axios.post("/api/category/list", { sessionUUID, categoryName });
};
