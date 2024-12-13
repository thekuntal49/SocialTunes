import React, { useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { MusicContext } from "../../context/MusicContext";
import { SongsListSkeleton } from "./SongsListSkeleton";
import { UserContext } from "../../context/userContext";

const SongList = () => {
  const { songs, isSongsLoading, setCurrentSong } = useContext(MusicContext);
  const { socket } = useContext(UserContext);

  const onDuoPlay = (song) => {
    if (socket) {
      socket.emit("songSocket", song);
      "Song emitted:", song;
    } else {
      console.error("Socket not connected");
    }
  };

  return (
    <>
      {isSongsLoading ? (
        <SongsListSkeleton />
      ) : (
        <Box
          sx={{
            padding: "1px",
            backgroundColor: "radial-gradient(circle, #2e0f13, #1b0005)",
            minHeight: "screen",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {songs.map((song) => (
              <Box
                key={song._id}
                onClick={() => {
                  onDuoPlay(song), setCurrentSong(song);
                }}
                sx={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
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
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: "2.5rem" }} />
                  </IconButton>
                </Box>

                <Box sx={{ padding: "1rem", backgroundColor: "#1a1a1a" }}>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {song.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {song.artist}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SongList;
