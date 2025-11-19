import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3000/user/api",
  withCredentials: true,
  validateStatus: () => true,
});

export default Api;
