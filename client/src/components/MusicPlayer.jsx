import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Box, Typography, Paper, Divider } from "@mui/material";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import { MusicContext } from "../context/MusicContext";

const MusicPlayer = () => {
  const { currentSong } = useContext(MusicContext);
  const { partner } = useContext(UserContext);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right top, #1a0000, #0f0f0f)",
        px: 2,
        py: 4,
        textAlign: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "rgba(40, 0, 0, 0.85)",
          backdropFilter: "blur(6px)",
          border: "1px solid #ff4c4c88",
          borderRadius: 4,
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          px: 3,
          py: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#ff4c4c",
            fontWeight: "bold",
            textShadow: "0 0 10px #ff4c4c66",
          }}
        >
          🎵 Listening with <span style={{ color: "#fff" }}>{partner?.partner}</span>
        </Typography>
        <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
          You're synced and ready to vibe together.
        </Typography>
        <Divider sx={{ backgroundColor: "#333", my: 2 }} />
      </Paper>

      <SongList />

      {currentSong && (
        <Box sx={{ mt: 4 }}>
          <PlayerControls />
        </Box>
      )}
    </Box>
  );
};

export default MusicPlayer;
