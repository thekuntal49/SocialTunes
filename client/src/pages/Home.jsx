import React from "react";
import { Box, Button, Typography, Stack, Grid, Container } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0c0c 0%, #2c0a0a 50%, #480d0d 100%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 12 },
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Hero Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "#ff4c4c",
                textShadow: "0 0 20px #ff4c4c50",
              }}
            >
              <MusicNoteIcon sx={{ fontSize: "2rem", mr: 1, mb: -0.5 }} />
              Social Tunes
            </Typography>

            <Typography variant="h6" sx={{ color: "#e0e0e0", mb: 4 }}>
              🎧 Sync your vibe. Share the music. Listen together in real time —
              whether you're solo or with a partner.
            </Typography>

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
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
                    backgroundColor: "rgba(255, 76, 76, 0.1)",
                  },
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Play with Partner
              </Button>
            </Stack>
          </Grid>

          {/* Right Side Visual (Optional: Add a background image or visualizer here) */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: "center", display: { xs: "none", md: "block" } }}
          >
            <DotLottieReact
              // src="https://lottie.host/6b3be79e-6f51-40bc-821e-6e9fb7fa42f7/vxoRGGelWI.lottie"
              src="https://lottie.host/3e69c3d5-9853-437e-93a3-46310af1f1be/o7se732ePB.lottie"
              loop
              autoplay
              style={{
                borderRadius: "16px",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
