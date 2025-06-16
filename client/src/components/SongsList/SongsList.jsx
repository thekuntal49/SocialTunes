import React, { useContext } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
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
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1a0000, #0f0f0f)",
        py: 6,
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#fff" }}
      >
        Available Tunes
      </Typography>

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
        <Grid container spacing={4}>
          {songs.map((song) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={song._id}>
              <Card
                onClick={() => {
                  onPlay(song);
                  setCurrentSong(song);
                }}
                sx={{
                  backgroundColor: "#1c0d0d",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(255, 76, 76, 0.15)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(255, 76, 76, 0.25)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={song.thumbnail}
                    alt={song.name}
                    sx={{ filter: "brightness(0.9)" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#ff4c4c",
                      },
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: "2rem" }} />
                  </IconButton>
                </Box>
                <CardContent sx={{ color: "#fff" }}>
                  <Typography variant="h6" noWrap>
                    {song.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#bbb", fontStyle: "italic" }}
                    noWrap
                  >
                    {song.artist}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SongList;
