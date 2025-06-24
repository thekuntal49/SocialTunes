import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Container,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SurroundSoundIcon from "@mui/icons-material/SurroundSound";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RadioIcon from "@mui/icons-material/Radio";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import AlbumIcon from "@mui/icons-material/Album";

export const UserName = () => {
  const { setUser } = useContext(UserContext);
  const [inputName, setInputName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const musicIcons = [
    <MusicNoteIcon />,
    <HeadphonesIcon />,
    <AudiotrackIcon />,
    <SurroundSoundIcon />,
    <GraphicEqIcon />,
    <VolumeUpIcon />,
    <RadioIcon />,
    <LibraryMusicIcon />,
    <AlbumIcon />,
  ];

  const nameSuggestions = [
    "MelodyMaker", "BeatMaster", "SoundWave", "RhythmRider", 
    "AudioVibe", "TuneTitan", "MusicMaven", "SonicSoul",
    "HarmonyHero", "BassBooster", "EchoEcho", "VibeChecker"
  ];

  useEffect(() => {
    setIsLoaded(true);
    // Rotate music icons
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % musicIcons.length);
    }, 2000);

    return () => clearInterval(iconInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUser(inputName.trim());
      toast.success(`🎵 Welcome to the vibe, ${inputName}! 🎵`, {
        style: {
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 'bold',
        },
      });
    } else {
      toast.error("Please enter a valid name!", {
        style: {
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          color: 'white',
        },
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputName(suggestion);
    setShowSuggestions(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: "float 6s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      }}
    >
      {/* Floating Music Elements */}
      {[...Array(8)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            animation: `floatRandom${index} ${8 + index * 2}s ease-in-out infinite`,
            opacity: 0.1,
            fontSize: "2rem",
            color: "white",
            "@keyframes floatRandom0": {
              "0%, 100%": { transform: "translate(10vw, 10vh) rotate(0deg)" },
              "50%": { transform: "translate(15vw, 5vh) rotate(180deg)" },
            },
            "@keyframes floatRandom1": {
              "0%, 100%": { transform: "translate(80vw, 20vh) rotate(0deg)" },
              "50%": { transform: "translate(75vw, 25vh) rotate(-180deg)" },
            },
            "@keyframes floatRandom2": {
              "0%, 100%": { transform: "translate(20vw, 80vh) rotate(0deg)" },
              "50%": { transform: "translate(25vw, 75vh) rotate(90deg)" },
            },
            "@keyframes floatRandom3": {
              "0%, 100%": { transform: "translate(70vw, 70vh) rotate(0deg)" },
              "50%": { transform: "translate(65vw, 65vh) rotate(-90deg)" },
            },
            "@keyframes floatRandom4": {
              "0%, 100%": { transform: "translate(5vw, 50vh) rotate(0deg)" },
              "50%": { transform: "translate(10vw, 45vh) rotate(270deg)" },
            },
            "@keyframes floatRandom5": {
              "0%, 100%": { transform: "translate(90vw, 40vh) rotate(0deg)" },
              "50%": { transform: "translate(85vw, 35vh) rotate(-270deg)" },
            },
            "@keyframes floatRandom6": {
              "0%, 100%": { transform: "translate(40vw, 10vh) rotate(0deg)" },
              "50%": { transform: "translate(45vw, 15vh) rotate(360deg)" },
            },
            "@keyframes floatRandom7": {
              "0%, 100%": { transform: "translate(60vw, 90vh) rotate(0deg)" },
              "50%": { transform: "translate(55vw, 85vh) rotate(-360deg)" },
            },
          }}
        >
          {musicIcons[index % musicIcons.length]}
        </Box>
      ))}

      <Container maxWidth="sm">
        <Fade in={isLoaded} timeout={1000}>
          <Card
            elevation={25}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(30px)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              overflow: "visible",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)",
                borderRadius: "24px",
                zIndex: -1,
                animation: "borderGlow 3s linear infinite",
              },
              "@keyframes borderGlow": {
                "0%": { opacity: 0.5 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.5 },
              },
            }}
          >
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              {/* Animated Header Icon */}
              <Zoom in={isLoaded} timeout={800}>
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                      animation: "pulse 2s ease-in-out infinite",
                      fontSize: "3rem",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        transition: "all 0.5s ease",
                        transform: `rotate(${currentIcon * 40}deg)`,
                      }}
                    >
                      {musicIcons[currentIcon]}
                    </Box>
                  </Avatar>

                  {/* Rotating Ring */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 140,
                      height: 140,
                      border: "2px dashed rgba(255,255,255,0.3)",
                      borderRadius: "50%",
                      animation: "rotate 10s linear infinite",
                      "@keyframes rotate": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </Box>
              </Zoom>

              {/* Title with Gradient Text */}
              <Fade in={isLoaded} timeout={1200}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(45deg, #fff, #f0f0f0, #fff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "200% 200%",
                    animation: "textShimmer 3s ease-in-out infinite",
                    mb: 2,
                    textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    fontSize: {
                      xs: "2rem",
                      sm: "2.5rem",
                      md: "3rem",
                    },
                    "@keyframes textShimmer": {
                      "0%, 100%": { backgroundPosition: "0% 50%" },
                      "50%": { backgroundPosition: "100% 50%" },
                    },
                  }}
                >
                  🎵 Set Your Vibe Identity 🎵
                </Typography>
              </Fade>

              <Fade in={isLoaded} timeout={1400}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                      md: "1.25rem",
                    },
                  }}
                >
                  Ready to sync your soul with music? Choose a username that vibes with your energy. 
                  <br />
                  <Box component="span" sx={{ fontSize: "0.9em", opacity: 0.8 }}>
                    Something cool, quirky, or mysterious – it's your moment to shine! ✨
                  </Box>
                </Typography>
              </Fade>

              {/* Enhanced Input Form */}
              <Zoom in={isLoaded} timeout={1600}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mb: 3 }}
                >
                  <TextField
                    fullWidth
                    placeholder="Enter your vibe name..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        height: "64px",
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        color: "#fff",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.15)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 0.2)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                          transition: "all 0.3s ease",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "2px solid rgba(255, 255, 255, 0.4)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "2px solid rgba(255, 255, 255, 0.8)",
                        },
                      },
                    }}
                    sx={{ mb: 3 }}
                  />

                  {/* Name Suggestions */}
                  {showSuggestions && (
                    <Fade in={showSuggestions}>
                      <Paper
                        sx={{
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(20px)",
                          borderRadius: "12px",
                          p: 2,
                          mb: 3,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "rgba(255,255,255,0.8)", mb: 1, fontWeight: 600 }}
                        >
                          💡 Need inspiration? Try these:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {nameSuggestions.slice(0, 6).map((suggestion, index) => (
                            <Chip
                              key={suggestion}
                              label={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "white",
                                fontWeight: 500,
                                mb: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  background: "rgba(255, 255, 255, 0.25)",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                },
                                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                                "@keyframes fadeInUp": {
                                  from: {
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                  },
                                  to: {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    </Fade>
                  )}

                  {/* Enhanced Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!inputName.trim()}
                    sx={{
                      height: "56px",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: "16px",
                      background: inputName.trim() 
                        ? "linear-gradient(45deg, #667eea, #764ba2)" 
                        : "rgba(255, 255, 255, 0.1)",
                      color: inputName.trim() ? "white" : "rgba(255, 255, 255, 0.5)",
                      boxShadow: inputName.trim() 
                        ? "0 8px 32px rgba(102, 126, 234, 0.4)" 
                        : "none",
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      px: 4,
                      "&:hover": {
                        background: inputName.trim() 
                          ? "linear-gradient(45deg, #5a67d8, #6b46c1)" 
                          : "rgba(255, 255, 255, 0.15)",
                        transform: inputName.trim() ? "translateY(-3px)" : "none",
                        boxShadow: inputName.trim() 
                          ? "0 12px 40px rgba(102, 126, 234, 0.6)" 
                          : "none",
                      },
                      "&:disabled": {
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  >
                    🚀 Start Your Musical Journey
                  </Button>
                </Box>
              </Zoom>

              {/* Fun Stats */}
              <Fade in={isLoaded} timeout={2000}>
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 4 }}
                >
                  {[
                    { icon: <HeadphonesIcon />, label: "Ready to Vibe", value: "∞" },
                    { icon: <GraphicEqIcon />, label: "Beat Sync", value: "100%" },
                    { icon: <VolumeUpIcon />, label: "Energy Level", value: "MAX" },
                  ].map((stat, index) => (
                    <Paper
                      key={stat.label}
                      sx={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "12px",
                        p: 2,
                        textAlign: "center",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        minWidth: "80px",
                        animation: `slideUp 0.6s ease ${index * 0.2}s both`,
                        "@keyframes slideUp": {
                          from: {
                            opacity: 0,
                            transform: "translateY(30px)",
                          },
                          to: {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                        },
                      }}
                    >
                      <Box sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Fade>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};