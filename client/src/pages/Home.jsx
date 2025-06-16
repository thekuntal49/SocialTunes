import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Container,
  Card,
  CardContent,
  Fade,
  Grow,
  useTheme,
  alpha,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <HeadphonesIcon sx={{ fontSize: "2rem", color: "#ff4c4c" }} />,
      title: "Ad-Free Experience",
      desc: "Pure music, no interruptions",
    },
    {
      icon: <FlashOnIcon sx={{ fontSize: "2rem", color: "#ff4c4c" }} />,
      title: "Real-Time Sync",
      desc: "Perfect synchronization with partners",
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: "2rem", color: "#ff4c4c" }} />,
      title: "Social Listening",
      desc: "Share moments through music",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0c0c 0%, #2c0a0a 50%, #480d0d 100%)",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "& .floating-bg": {
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(100px)",
            animation: "pulse 4s ease-in-out infinite",
          },
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 0.6 },
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      >
        <Box
          className="floating-bg"
          sx={{
            width: "400px",
            height: "400px",
            backgroundColor: alpha("#ff4c4c", 0.1),
            left: mousePosition.x * 0.01 + "%",
            top: mousePosition.y * 0.01 + "%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <Box
          className="floating-bg"
          sx={{
            width: "300px",
            height: "300px",
            backgroundColor: alpha("#ff6b6b", 0.05),
            top: "25%",
            right: "25%",
            animationDelay: "1s",
          }}
        />
        <Box
          className="floating-bg"
          sx={{
            width: "200px",
            height: "200px",
            backgroundColor: alpha("#ff8a80", 0.05),
            bottom: "25%",
            left: "25%",
            animationDelay: "2s",
          }}
        />

        {/* Floating Music Notes */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animation: "float 4s ease-in-out infinite",
              animationDelay: `${i * 0.5}s`,
              opacity: 0.2,
            }}
          >
            <MusicNoteIcon sx={{ fontSize: "1rem", color: "#ff4c4c" }} />
          </Box>
        ))}
      </Box>

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 10, py: { xs: 8, md: 12 } }}
      >
        {/* Header */}
        <Fade in={isVisible} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Grow in={isVisible} timeout={1200}>
              <Box sx={{ display: "inline-flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    position: "relative",
                    p: 2,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                    boxShadow: "0 0 30px rgba(255, 76, 76, 0.5)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                >
                  <MusicNoteIcon sx={{ fontSize: "2.5rem", color: "#fff" }} />
                </Box>
              </Box>
            </Grow>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ffffff, #ff4c4c, #ff6b6b)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 4,
                fontSize: { xs: "3rem", md: "5rem" },
                textShadow: "0 0 20px rgba(255, 76, 76, 0.3)",
              }}
            >
              Social Tunes
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#e0e0e0",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              🎧 Sync your vibe. Share the music. Listen together in real time —
              whether you're solo or with a partner.
            </Typography>
          </Box>
        </Fade>

        {/* Main CTA Buttons */}
        <Fade in={isVisible} timeout={1500}>
          <Stack
            spacing={3}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            sx={{ mb: 10 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/player?mode=single")}
              sx={{
                background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                color: "#fff",
                px: 6,
                py: 2,
                borderRadius: 4,
                fontWeight: "bold",
                fontSize: "1.1rem",
                textTransform: "none",
                boxShadow: "0 10px 30px rgba(255, 76, 76, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #e53935, #ff5252)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 35px rgba(255, 76, 76, 0.4)",
                },
              }}
            >
              Play Solo
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GroupIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/player?mode=duo")}
              sx={{
                borderColor: "#ff4c4c",
                color: "#ff4c4c",
                px: 6,
                py: 2,
                borderRadius: 4,
                fontWeight: "bold",
                fontSize: "1.1rem",
                textTransform: "none",
                borderWidth: 2,
                backdropFilter: "blur(10px)",
                backgroundColor: alpha("#ff4c4c", 0.05),
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#ff6b6b",
                  backgroundColor: alpha("#ff4c4c", 0.15),
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 35px rgba(255, 76, 76, 0.2)",
                },
              }}
            >
              Sync with Partner
            </Button>
          </Stack>
        </Fade>

        {/* Features Grid */}
        <Fade in={isVisible} timeout={2000}>
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={isVisible} timeout={2000 + index * 200}>
                  <Card
                    sx={{
                      background: alpha("#ffffff", 0.05),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha("#ff4c4c", 0.2)}`,
                      borderRadius: 4,
                      p: 3,
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha("#ffffff", 0.1),
                        transform: "translateY(-10px)",
                        boxShadow: "0 20px 40px rgba(255, 76, 76, 0.2)",
                        border: `1px solid ${alpha("#ff4c4c", 0.4)}`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "inline-flex",
                          p: 2,
                          borderRadius: 3,
                          background: alpha("#ff4c4c", 0.1),
                          mb: 3,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#e0e0e0",
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Fade>

        {/* Stats Section */}
        <Fade in={isVisible} timeout={2500}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                "#ffffff",
                0.1
              )}, ${alpha("#ff4c4c", 0.05)})`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha("#ff4c4c", 0.3)}`,
              borderRadius: 4,
              p: 6,
              textAlign: "center",
              mb: 8,
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    "&:hover": { transform: "scale(1.05)" },
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    100%
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#e0e0e0", fontWeight: 500 }}
                  >
                    Ad-Free
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    "&:hover": { transform: "scale(1.05)" },
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    &lt;1ms
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#e0e0e0", fontWeight: 500 }}
                  >
                    Sync Latency
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    "&:hover": { transform: "scale(1.05)" },
                    transition: "transform 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    50+
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#e0e0e0", fontWeight: 500 }}
                  >
                    Music Library
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Fade>

        {/* Lottie Animation */}
        <Fade in={isVisible} timeout={3000}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <DotLottieReact
                  src="https://lottie.host/3e69c3d5-9853-437e-93a3-46310af1f1be/o7se732ePB.lottie"
                  loop
                  autoplay
                  style={{
                    borderRadius: "20px",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" sx={{ color: "#e0e0e0", mb: 1 }}>
                  🎧 Ready to vibe with a friend?
                </Typography>
                <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
                  Real-time synced music, no downloads, no delays—just pure
                  connection.
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      sx={{ color: "#ffd700", fontSize: "1.4rem" }}
                    />
                  ))}
                  <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 2 }}>
                    Built with ❤️ for music lovers
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 3, color: "#888" }}
                >
                  © {new Date().getFullYear()} Social Tunes · All rights
                  reserved
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
