import axios from "axios";

export const getTransAPI = (
  date,
  payee,
  categoryName,
  subCategoryName,
  amount,
  perspective
) => {
  return axios.get("/api/transaction/list", {
    date,
    payee,
    categoryName,
    subCategoryName,
    amount,
    perspective
  });
};

export const createTransAPI = (
  sessionUUID,
  accountUUID,
  payee,
  categoryUUID,
  subCategoryUUID,
  amount
) => {
  return axios.post("/api/transaction/create", {
    sessionUUID,
    accountUUID,
    payee,
    categoryUUID,
    subCategoryUUID,
    amount
  });
};

export const delTransAPI = (sessionUUID, transactionUUID) => {
  return axios.post("/api/transaction/delete", {
    sessionUUID,
    transactionUUID
  });
};
