import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.43.102:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
