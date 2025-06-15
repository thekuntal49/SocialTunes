import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { Button, Box, Typography, TextField, Paper } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export const UserName = () => {
  const { setUser } = useContext(UserContext);
  const [inputName, setInputName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUser(inputName.trim());
    } else {
      alert("Please enter a valid name!");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to bottom right, #1a0000, #0c0c0c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          backgroundColor: "rgba(30, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#ff4c4c", display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}
        >
          <MusicNoteIcon />
          Let’s Get Started
        </Typography>

        <Typography variant="body1" color="#ddd" mb={3}>
          Tell us your vibe name. This is how your partner will see you!
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Enter your name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            variant="outlined"
            sx={{
              input: {
                color: "#fff",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ff4c4c",
              },
              mb: 2,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ff4c4c",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e53935",
              },
            }}
          >
            Start Listening
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
