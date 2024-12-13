import React, { createContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState(null);
  const [isSongsLoading, setIsSongsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);

  const fetchSongs = async () => {
    try {
      const response = await axiosInstance.get("/music");
      setSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsSongsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    
  }, []);

  const contextValue = useMemo(
    () => ({
      songs,
      isSongsLoading,
      currentSong,
      setCurrentSong,
    }),
    [songs, isSongsLoading, currentSong]
  );

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};
