import axios from "axios";

export const login = (data) => axios.post("/api/login", data);
export const register = (data) => axios.post("/api/register", data);

export const BudgetAPI = {
  getBudgetList: (data, option) => {
    return axios.post(`/api/budgetAccountlist/${option}`, data);
  },
};
