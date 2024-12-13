import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://socialtunes.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
