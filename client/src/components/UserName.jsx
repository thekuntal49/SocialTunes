import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Container,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export const UserName = () => {
  const { setUser } = useContext(UserContext);
  const [inputName, setInputName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUser(inputName.trim());
      toast.success(`You're connected as ${inputName}!`);
    } else {
      toast.error("Please enter a valid name!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://i.pinimg.com/736x/70/1a/9a/701a9a54c2556925d1826df35386ccc2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#ff4c4c",
            }}
          >
            <MusicNoteIcon />
            Set Your Vibe Identity
          </Typography>

          <Typography variant="body2" sx={{ color: "#ccc", mb: 3 }}>
            Before vibing with your partner, choose your username. Something
            cool, quirky or mysterious – it's your call 🎧
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="e.g. VibePaglu"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              variant="outlined"
              sx={{
                input: {
                  color: "#fff",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  padding: "14px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff4c4c",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
                mb: 3,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #ff4c4c, #e53935)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                py: 1.4,
                borderRadius: "8px",
                boxShadow: "0 4px 14px rgba(255, 76, 76, 0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #e53935, #d32f2f)",
                },
              }}
            >
              Start Listening
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
