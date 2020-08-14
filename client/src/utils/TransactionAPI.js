import axios from "axios";

export const getTransAPI = (sessionUUID, accountUUID) => {
  return axios.post("/api/transaction/list", {
    sessionUUID,
    accountUUID,
    filter: []
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
  return axios.delete("/api/transaction/delete", {
    sessionUUID,
    transactionUUID
  });
};

export const getBalance = (sessionUUID, accountUUID, balance) => {
  return axios.get("/api/budgetAccount/list", {
    sessionUUID,
    accountUUID,
    balance
  });
};
