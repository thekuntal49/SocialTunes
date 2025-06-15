import React from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c0c 0%, #2c0a0a 40%, #480d0d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          backgroundColor: "rgba(30, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            color: "#ff4c4c",
            mb: 1,
          }}
        >
          <MusicNoteIcon fontSize="large" sx={{ mr: 1, color: "#ff4c4c" }} />
          Social Tunes 🎧
        </Typography>
        <Typography variant="subtitle1" color="#e0e0e0" mb={4}>
          Share the vibe. Listen together in real-time — solo or synced.
        </Typography>

        <Stack spacing={2} direction="column">
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            onClick={() => navigate("/player?mode=single")}
            sx={{
              backgroundColor: "#ff4c4c",
              color: "#fff",
              "&:hover": { backgroundColor: "#e53935" },
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            Play Solo
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GroupIcon />}
            onClick={() => navigate("/player?mode=duo")}
            sx={{
              borderColor: "#ff4c4c",
              color: "#ff4c4c",
              "&:hover": {
                borderColor: "#ff4c4c",
                backgroundColor: "rgba(255, 76, 76, 0.1)",
              },
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            Play with Partner
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Home;
