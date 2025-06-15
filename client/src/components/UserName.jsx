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
        background: "linear-gradient(135deg, #0f0c0c, #1a0000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#fff",
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

          <Typography variant="body1" sx={{ color: "#bbb", mb: 3 }}>
            Before we sync you up with your partner, tell us what you'd like to
            be called during the session. Choose something fun, cool, or totally
            random.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="e.g. VivePaglu"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              variant="outlined"
              sx={{
                input: {
                  color: "#fff",
                  backgroundColor: "#2c2c2c",
                  borderRadius: "8px",
                  padding: "12px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff4c4c",
                },
                mb: 3,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#ff4c4c",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                py: 1.2,
                "&:hover": {
                  backgroundColor: "#e53935",
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
