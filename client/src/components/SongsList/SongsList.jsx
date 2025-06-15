import React, { useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import { MusicContext } from "../../context/MusicContext";
import { SongsListSkeleton } from "./SongsListSkeleton";
import { UserContext } from "../../context/userContext";

const SongList = () => {
  const { songs, isSongsLoading, setCurrentSong } = useContext(MusicContext);
  const { user, partner, socket } = useContext(UserContext);

  const onPlay = (song) => {
    if (socket) {
      socket.emit("songSocket", { song, user, partner });
    } else {
      console.error("Socket not connected");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1a0000, #0f0f0f)",
        p: 4,
      }}
    >
      {isSongsLoading ? (
        <SongsListSkeleton />
      ) : songs.length === 0 ? (
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#ff4c4c",
            textAlign: "center",
          }}
        >
          <MusicOffIcon sx={{ fontSize: "4rem", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Songs Available
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            Looks like your vibe list is empty.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {songs.map((song) => (
            <Box
              key={song._id}
              onClick={() => {
                onPlay(song);
                setCurrentSong(song);
              }}
              sx={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "#1c0d0d",
                boxShadow: "0 4px 15px rgba(255, 76, 76, 0.15)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.04)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%",
                  backgroundImage: `url(${song.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 76, 76, 0.8)",
                    },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: "2.5rem" }} />
                </IconButton>
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: "#fff" }} noWrap>
                  {song.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ccc", fontStyle: "italic" }}
                  noWrap
                >
                  {song.artist}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SongList;
