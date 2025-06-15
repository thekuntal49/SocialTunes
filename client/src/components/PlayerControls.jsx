import React, { useRef, useState, useEffect, useContext } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { MusicContext } from "../context/MusicContext";
import { UserContext } from "../context/userContext";

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
  }, [socket]);

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
      socket.emit("togglePlayPause", { isPlaying: newState });
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
            background: "linear-gradient(180deg, #1e1e1e, #121212)",
            padding: "1rem",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            "@media (max-width: 600px)": {
              padding: "0.8rem",
            },
          }}
        >
          {/* Remove Player */}
          <IconButton
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              color: "#ff5252",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Thumbnail and Track Info */}
          <Box display="flex" alignItems="center" gap={3}>
            <img
              src={currentSong.thumbnail}
              alt={currentSong.name}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                {currentSong.name}
              </Typography>
              <Typography
                sx={{
                  color: "#bbb",
                  fontSize: "0.9rem",
                }}
              >
                {currentSong.artist}
              </Typography>
            </Box>
          </Box>

          {/* Controls */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                color: "#1db954",
                backgroundColor: "rgba(29, 185, 84, 0.1)",
                "&:hover": { backgroundColor: "rgba(29, 185, 84, 0.2)" },
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <SkipPreviousIcon />
            </IconButton>

            <IconButton
              onClick={togglePlayPause}
              sx={{
                color: isPlaying ? "#f44336" : "#1db954",
                backgroundColor: isPlaying
                  ? "rgba(244, 67, 54, 0.1)"
                  : "rgba(29, 185, 84, 0.1)",
                "&:hover": {
                  backgroundColor: isPlaying
                    ? "rgba(244, 67, 54, 0.2)"
                    : "rgba(29, 185, 84, 0.2)",
                },
                borderRadius: "50%",
                padding: "14px",
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                color: "#1db954",
                backgroundColor: "rgba(29, 185, 84, 0.1)",
                "&:hover": { backgroundColor: "rgba(29, 185, 84, 0.2)" },
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <SkipNextIcon />
            </IconButton>
          </Box>

          {/* Time and Volume */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            sx={{
              width: "100%",
              "@media (max-width: 600px)": {
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "0.9rem",
                flex: "none",
                whiteSpace: "nowrap",
              }}
            >
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
                color: "#1db954",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#1db954",
                },
              }}
            />

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                flex: "none",
                "@media (max-width: 600px)": {
                  width: "100%",
                  justifyContent: "center",
                },
              }}
            >
              <VolumeUpIcon sx={{ color: "#1db954" }} />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                sx={{
                  width: "100px",
                  color: "#1db954",
                }}
              />
            </Box>
          </Box>

          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlayerControls;
