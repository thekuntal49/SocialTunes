import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "radial-gradient(circle, #1f1f1f, #121212)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        🎧
      </Typography>
      <Stack spacing={3} direction="column" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/player?mode=single")}
        >
          Play Solo
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/player?mode=duo")}
        >
          Play with Partner
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
