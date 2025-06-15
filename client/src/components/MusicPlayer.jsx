import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { Box, Button, Typography } from "@mui/material";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import { MusicContext } from "../context/MusicContext";

const MusicPlayer = () => {
  const { currentSong } = useContext(MusicContext);
  const { partner } = useContext(UserContext);

  return (
    <Box sx={{ textAlign: "center", padding: "1rem" }}>
      <Typography variant="h5" sx={{ color: "#ff5252", margin: "1rem" }}>
        🎵 Listening with {partner.partner}
      </Typography>
      <SongList />
      {currentSong && <PlayerControls />}
    </Box>
  );
};

export default MusicPlayer;
