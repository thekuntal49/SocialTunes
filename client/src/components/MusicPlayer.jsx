import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { Box, Button, Typography } from "@mui/material";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import { MusicContext } from "../context/MusicContext";

const MusicPlayer = ({ partner, isController, setIsController }) => {
  const { socket, user } = useContext(UserContext);
  const { currentSong } = useContext(MusicContext);

  useEffect(() => {
    if (socket) {
      socket.on("musicSync", ({ action, timestamp }) => {
        if (!isController) {
          // Perform play, pause, or seek actions
          `Sync Action: ${action}, Timestamp: ${timestamp}`;
        }
      });

      socket.on("controlSwitch", ({ from }) => {
        setIsController(from === socket.id);
      });
    }
  }, [socket, isController]);

  const handleControlTransfer = () => {
    if (socket) {
      socket.emit("switchControl", { toSocketId: partner.socketId });
    }
    setIsController(false);
  };

  const handleMusicAction = (action) => {
    if (socket && isController) {
      const timestamp = new Date().getTime(); // Example timestamp
      socket.emit("syncMusic", { action, timestamp });
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: "1rem" }}>
      <Typography variant="h5" sx={{ color: "#ff5252", margin: "1rem" }}>
        🎵 Listening with {partner.partner}
      </Typography>
      {/* <MusicSearch onSongSelect={(song) => setCurrentSong(song)} /> */}
      <SongList />
      {currentSong && <PlayerControls />}
    </Box>
  );
};

export default MusicPlayer;
