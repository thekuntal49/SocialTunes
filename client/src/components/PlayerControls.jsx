import React, { useRef, useState, useEffect, useContext } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { MusicContext } from "../context/MusicContext";
import { UserContext } from "../context/UserContext";

const PlayerControls = () => {
  const { currentSong, songs, setCurrentSong } = useContext(MusicContext);
  const { socket } = useContext(UserContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  // Listen for real-time events from the server
  useEffect(() => {
    if (socket) {
      // Listen for song updates
      socket.on("songSockett", ({ song, user, partner }) => {
        console.log("Song received:", song, user, partner);
        setCurrentSong(song);
      });

      // Listen for play/pause state updates
      socket.on("PlayPause", ({ isPlaying }) => {
        console.log("Play/Pause event received:", isPlaying);
        setIsPlaying(isPlaying);

        if (audioRef.current) {
          if (isPlaying) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }
      });

      // Clean up listeners on unmount
      return () => {
        socket.off("songSockett");
        socket.off("PlayPause");
      };
    }
  }, [socket, currentSong]);

  // Toggle play/pause state and notify the server
  const togglePlayPause = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);

    if (audioRef.current) {
      if (newState) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }

    if (socket) {
      socket.emit("togglePlayPause", {
        isPlaying: newState,
        partner: currentSong.partner,
      });
    }
  };

  // Handle volume change
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  // Update current time of the song
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Automatically fetch the song's duration
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Switch to the next song
  const handleNext = () => {
    for (let i = 0; i < songs.length; i++) {
      if (currentSong._id === songs[i]._id) {
        if (!songs[i + 1]) {
          setCurrentSong(songs[0]);
        } else {
          setCurrentSong(songs[i + 1]);
        }
      }
    }
  };

  // Switch to the previous song
  const handlePrev = () => {
    for (let i = 0; i < songs.length; i++) {
      if (currentSong._id === songs[i]._id) {
        if (!songs[i - 1]) {
          setCurrentSong(songs[songs.length - 1]);
        } else {
          setCurrentSong(songs[i - 1]);
        }
      }
    }
  };

  // Automatically play the next song when the current one ends
  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("ended", handleNext);
    return () => {
      audio.removeEventListener("ended", handleNext);
    };
  }, [currentSong]);

  // Format time in mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const onRemove = () => {
    setCurrentSong(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      event;
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.code === "Space") {
        // Use event.code for more reliable detection
        event.preventDefault(); // Prevent the default scroll behavior
        togglePlayPause();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {currentSong ? (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(160deg, #1e1e1e, #0f0f0f)",
            padding: "1.2rem 2rem",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -6px 20px rgba(0, 0, 0, 0.5)",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* Close Player */}
          <IconButton
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: "0.6rem",
              right: "0.6rem",
              color: "#f44336",
              bgcolor: "rgba(255, 82, 82, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 82, 82, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Thumbnail & Info */}
          <Box display="flex" alignItems="center" gap={2.5}>
            <img
              src={currentSong.thumbnail}
              alt={currentSong.name}
              style={{
                width: 68,
                height: 68,
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.2,
                  textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                }}
              >
                {currentSong.name}
              </Typography>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                {currentSong.artist}
              </Typography>
            </Box>
          </Box>

          {/* Controls */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={3}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                color: "#1db954",
                bgcolor: "rgba(29, 185, 84, 0.08)",
                "&:hover": { bgcolor: "rgba(29, 185, 84, 0.2)" },
                p: 1.2,
                borderRadius: "50%",
              }}
            >
              <SkipPreviousIcon />
            </IconButton>

            <IconButton
              onClick={togglePlayPause}
              sx={{
                color: isPlaying ? "#f44336" : "#1db954",
                bgcolor: isPlaying
                  ? "rgba(244, 67, 54, 0.1)"
                  : "rgba(29, 185, 84, 0.1)",
                "&:hover": {
                  bgcolor: isPlaying
                    ? "rgba(244, 67, 54, 0.2)"
                    : "rgba(29, 185, 84, 0.2)",
                },
                p: 1.6,
                borderRadius: "50%",
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                color: "#1db954",
                bgcolor: "rgba(29, 185, 84, 0.08)",
                "&:hover": { bgcolor: "rgba(29, 185, 84, 0.2)" },
                p: 1.2,
                borderRadius: "50%",
              }}
            >
              <SkipNextIcon />
            </IconButton>
          </Box>

          {/* Time & Volume */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            sx={{ mt: 1 }}
          >
            <Typography sx={{ color: "#fff", fontSize: "0.85rem" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <Slider
              value={(currentTime / duration) * 100 || 0}
              onChange={(e, newValue) => {
                const newTime = (newValue / 100) * duration;
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }}
              sx={{
                flex: 1,
                mx: 2,
                color: "#1db954",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                },
              }}
            />

            <Box display="flex" alignItems="center" gap={1}>
              <VolumeUpIcon sx={{ color: "#1db954" }} />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                sx={{
                  width: 100,
                  color: "#1db954",
                  "& .MuiSlider-thumb": {
                    width: 10,
                    height: 10,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />
        </Box>
      ) : null}
    </>
  );
};

export default PlayerControls;
