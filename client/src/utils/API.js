import axios from 'axios';

export const login = data => axios.post("/api/user/login", data);
export const register = data => axios.post("/api/user/register", data);

