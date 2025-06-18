import axios from "axios";
import { attachInterceptors } from "./interceptors";

const http = axios.create({
  baseURL: import.meta.env.VITE_PRIVATE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachInterceptors(http);

export default http;
