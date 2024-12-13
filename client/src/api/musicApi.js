import { axiosInstance } from "./axiosInstance";

const fetchSongs = async () => {
  try {
    const response = await axiosInstance.get("/music");
    console.log(response.data.songs);
    return response.data.songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

const fetchActiveUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
