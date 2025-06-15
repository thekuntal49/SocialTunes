import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://social-tunes.onrender.com/api",
  // baseURL: "http://192.168.1.2:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
