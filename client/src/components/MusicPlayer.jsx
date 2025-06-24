import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../context/userContext";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Fade,
  Card,
  CardContent,
  Tooltip,
  Paper,
  Zoom,
  Slide,
} from "@mui/material";
import { MusicContext } from "../context/MusicContext";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import toast from "react-hot-toast";
import { Howl } from "howler";
import Peer from "simple-peer/simplepeer.min.js";

const MusicPlayer = () => {
  const { currentSong } = useContext(MusicContext);
  const { partner, socket } = useContext(UserContext);

  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("online");
  const [incomingCall, setIncomingCall] = useState(null);
  const [showAcceptUI, setShowAcceptUI] = useState(false);
  const [soundId, setSoundId] = useState(null);
  
  // New state for enhanced UI
  const [localVideoMuted, setLocalVideoMuted] = useState(false);
  const [remoteVideoMuted, setRemoteVideoMuted] = useState(false);
  const [localVideoPaused, setLocalVideoPaused] = useState(false);
  const [remoteVideoPaused, setRemoteVideoPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStream = useRef(null);
  const videoContainerRef = useRef(null);

  const ringtone = new Howl({
    src: ["/ringtone.mp3"],
    loop: false,
    volume: 1.0,
  });

  const ICE_SERVERS = [
    {
      urls: ["stun:bn-turn2.xirsys.com"],
    },
    {
      username:
        "KOo7L3-HXfompS_KFnBUpL2zPDmkLE18D7lfVKqr1bexPhmECxYyB5rcOM9ZYcrmAAAAAGhY84BibGF0aGVyNDAyMQ==",
      credential: "f2f0e73e-4ffa-11f0-b8dc-0242ac140004",
      urls: [
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
      ],
    },
  ];

  // Enhanced controls auto-hide functionality
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    const timeout = setTimeout(() => {
      if (videoEnabled && !showAcceptUI) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [controlsTimeout, videoEnabled, showAcceptUI]);

  useEffect(() => {
    if (videoEnabled) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [videoEnabled, resetControlsTimeout]);

  // Video control functions
  const toggleLocalVideoMute = () => {
    if (localVideoRef.current) {
      localVideoRef.current.muted = !localVideoRef.current.muted;
      setLocalVideoMuted(!localVideoMuted);
    }
  };

  const toggleRemoteVideoMute = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setRemoteVideoMuted(!remoteVideoMuted);
    }
  };

  const toggleLocalVideoPause = () => {
    if (localVideoRef.current) {
      if (localVideoPaused) {
        localVideoRef.current.play();
      } else {
        localVideoRef.current.pause();
      }
      setLocalVideoPaused(!localVideoPaused);
    }
  };

  const toggleRemoteVideoPause = () => {
    if (remoteVideoRef.current) {
      if (remoteVideoPaused) {
        remoteVideoRef.current.play();
      } else {
        remoteVideoRef.current.pause();
      }
      setRemoteVideoPaused(!remoteVideoPaused);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleMicrophone = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  // Get local media stream
  const getLocalStream = async () => {
    try {
      if (!localStream.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStream.current = stream;
        console.log("Got local stream");
      }

      // Always set the local video regardless of isRemote parameter
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      return localStream.current;
    } catch (error) {
      console.error("Error getting local stream:", error);
      throw error;
    }
  };

  // Caller clicks "Start Call"
  const startVideoCall = async () => {
    try {
      console.log("Starting video call");
      setIsConnecting(true);
      setVideoEnabled(true);

      const stream = await getLocalStream();

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        config: { iceServers: ICE_SERVERS },
      });

      peer.on("signal", (signal) => {
        socket.emit("call-user", {
          signal,
          to: partner.socketId,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peer.on("connect", () => {
        console.log("Connected to peer");
        setIsConnecting(false);
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        endCall();
      });

      peer.on("close", () => {
        console.log("Peer connection closed");
        endCall();
      });

      peerRef.current = peer;
    } catch (error) {
      console.error("Failed to start video call:", error);
      setIsConnecting(false);
      setVideoEnabled(false);
    }
  };

  // Define event handlers before using them
  const handleOffer = ({ signal, from }) => {
    console.log("Incoming call offer from:", from);
    setIncomingCall({ signal, from });
    setShowAcceptUI(true);
    const soundId = ringtone.play();
    setSoundId(soundId);
  };

  const handleDecline = () => {
    console.log("Call declined by partner");
    setIsConnecting(false);
    setVideoEnabled(false);
    setShowAcceptUI(false);
    setIncomingCall(null);

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStream.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    toast.error("Call declined by your partner.");
  };

  useEffect(() => {
    if (!socket) return;

    // Register event listeners
    socket.on("call-user", handleOffer);
    socket.on("answer-call", ({ signal }) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });
    socket.on("call-declined", handleDecline);
    socket.on("call-ended", endCall);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer-call", ({ signal }) => {
        if (peerRef.current) {
          peerRef.current.signal(signal);
        }
      });
      socket.off("call-declined", handleDecline);
      socket.off("call-ended", endCall);
    };
  }, [socket, partner?.socketId]);

  // On accept
  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    try {
      console.log("Accepting call from:", incomingCall.from);
      setIsConnecting(true);
      setVideoEnabled(true);

      const stream = await getLocalStream();

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
        config: { iceServers: ICE_SERVERS },
      });

      peer.on("signal", (signal) => {
        socket.emit("answer-call", {
          signal,
          to: incomingCall.from,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peer.on("connect", () => {
        console.log("Connected to peer");
        setIsConnecting(false);
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        endCall();
      });

      peer.on("close", () => {
        console.log("Peer connection closed");
        endCall();
      });

      peer.signal(incomingCall.signal);

      peerRef.current = peer;
      setShowAcceptUI(false);
      setIncomingCall(null);
      if (soundId) ringtone.stop(soundId);
    } catch (error) {
      console.error("Error accepting call:", error);
      setIsConnecting(false);
      setVideoEnabled(false);
    }
  };

  // On decline
  const handleDeclineCall = () => {
    if (!incomingCall) return;
    if (soundId) ringtone.stop(soundId);
    ringtone.stop();
    console.log("Declining call from:", incomingCall.from);
    socket.emit("call-declined", { to: incomingCall.from });
    setShowAcceptUI(false);
    setIncomingCall(null);
  };

  const endCall = (onEmit = null) => {
    console.log("Ending call");

    if (onEmit && socket && partner?.socketId) {
      socket.emit("call-ended", { to: partner.socketId });
    } else {
      toast.error("Call ended by your partner.");
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setVideoEnabled(false);
    setAudioEnabled(false);
    setIsConnecting(false);
    setConnectionStatus("online");
    setShowAcceptUI(false);
    setIncomingCall(null);
    setLocalVideoMuted(false);
    setRemoteVideoMuted(false);
    setLocalVideoPaused(false);
    setRemoteVideoPaused(false);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4caf50";
      case "online":
        return "#4caf50";
      case "connecting":
        return "#ff9800";
      case "disconnected":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(to right top, #1a0000, #0f0f0f)",
          px: 2,
          py: 4,
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        {partner && (
          <Fade in={true} timeout={800}>
            <Card
              elevation={20}
              sx={{
                maxWidth: 900,
                mx: "auto",
                mb: 4,
                background: "linear-gradient(135deg, rgba(26, 0, 0, 0.95), rgba(15, 15, 15, 0.95))",
                backdropFilter: "blur(20px)",
                borderRadius: 6,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                overflow: "visible",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Enhanced Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={3}
                  mb={3}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 72,
                        height: 72,
                        fontSize: "2rem",
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: getConnectionStatusColor(),
                        border: "3px solid white",
                        animation: connectionStatus === "connecting" ? "pulse 2s infinite" : "none",
                        "@keyframes pulse": {
                          "0%": { transform: "scale(1)", opacity: 1 },
                          "50%": { transform: "scale(1.2)", opacity: 0.7 },
                          "100%": { transform: "scale(1)", opacity: 1 },
                        },
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                        fontSize: {
                          xs: "1.8rem",
                          sm: "2.2rem",
                          md: "2.8rem",
                        },
                        textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {partner?.partner}
                    </Typography>

                    <Chip
                      label={isConnecting ? "Connecting..." : connectionStatus}
                      size="medium"
                      sx={{
                        bgcolor: getConnectionStatusColor(),
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        borderRadius: 3,
                        px: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        animation: isConnecting ? "pulse 2s infinite" : "none",
                      }}
                    />
                  </Box>
                </Stack>

                {/* Enhanced Video Container */}
                {videoEnabled && (
                  <Box
                    ref={videoContainerRef}
                    sx={{
                      position: "relative",
                      mb: 3,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "linear-gradient(45deg, #000, #1a1a1a)",
                      minHeight: 400,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                      border: "2px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseMove={resetControlsTimeout}
                    onMouseEnter={() => setShowControls(true)}
                  >
                    {/* Main remote video */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: isFullscreen ? "100vh" : 450,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={toggleRemoteVideoPause}
                    >
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        muted={remoteVideoMuted}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: isFullscreen ? "0px" : "16px",
                          filter: remoteVideoPaused ? "brightness(0.5)" : "none",
                          transition: "filter 0.3s ease",
                        }}
                      />

                      {/* Remote video controls overlay */}
                      <Fade in={remoteVideoPaused || showControls}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            gap: 2,
                            zIndex: 2,
                          }}
                        >
                          {remoteVideoPaused && (
                            <Zoom in={remoteVideoPaused}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRemoteVideoPause();
                                }}
                                sx={{
                                  bgcolor: "rgba(0,0,0,0.7)",
                                  color: "white",
                                  width: 64,
                                  height: 64,
                                  "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                                }}
                              >
                                <PlayArrowIcon fontSize="large" />
                              </IconButton>
                            </Zoom>
                          )}
                        </Box>
                      </Fade>

                      {/* Remote video mute button */}
                      <Fade in={showControls}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 3,
                          }}
                        >
                          <Tooltip title={remoteVideoMuted ? "Unmute" : "Mute"}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRemoteVideoMute();
                              }}
                              sx={{
                                bgcolor: "rgba(0,0,0,0.7)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                              }}
                            >
                              {remoteVideoMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Fade>

                      {/* Picture-in-picture local video */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          width: isFullscreen ? 240 : 200,
                          height: isFullscreen ? 160 : 130,
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "3px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            border: "3px solid rgba(255,255,255,0.6)",
                          },
                          zIndex: 4,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLocalVideoPause();
                        }}
                      >
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted={!localVideoMuted}
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: localVideoPaused ? "brightness(0.5)" : "none",
                            transition: "filter 0.3s ease",
                          }}
                        />

                        {/* Local video controls */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: localVideoPaused ? "flex" : "none",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLocalVideoPause();
                            }}
                            sx={{
                              bgcolor: "rgba(0,0,0,0.7)",
                              color: "white",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                            }}
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        </Box>

                        {/* Local video mute indicator */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 4,
                            right: 4,
                            bgcolor: localVideoMuted ? "error.main" : "success.main",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {localVideoMuted ? (
                            <VolumeOffIcon sx={{ fontSize: 12, color: "white" }} />
                          ) : (
                            <VolumeUpIcon sx={{ fontSize: 12, color: "white" }} />
                          )}
                        </Box>
                      </Box>

                      {/* Video control bar */}
                      <Slide direction="up" in={showControls}>
                        <Paper
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "rgba(0,0,0,0.8)",
                            borderRadius: 3,
                            p: 1,
                            display: "flex",
                            gap: 1,
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            zIndex: 5,
                          }}
                        >
                          <Tooltip title="Toggle Fullscreen">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen();
                              }}
                              sx={{ color: "white" }}
                            >
                              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                          </Tooltip>
                        </Paper>
                      </Slide>
                    </Box>
                  </Box>
                )}

                {/* Enhanced Controls */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  {showAcceptUI ? (
                    <Slide direction="up" in={showAcceptUI}>
                      <Box textAlign="center">
                        <Typography
                          variant="h5"
                          sx={{
                            mb: 3,
                            fontWeight: 700,
                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            animation: "pulse 2s infinite",
                          }}
                        >
                          📞 Incoming Video Call
                        </Typography>

                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={4}
                        >
                          <Tooltip title="Accept Call">
                            <IconButton
                              onClick={handleAcceptCall}
                              sx={{
                                width: 80,
                                height: 80,
                                bgcolor: "success.main",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "success.dark",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease-in-out",
                                boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
                              }}
                            >
                              <VideocamIcon fontSize="large" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Decline Call">
                            <IconButton
                              onClick={handleDeclineCall}
                              sx={{
                                width: 80,
                                height: 80,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "error.dark",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease-in-out",
                                boxShadow: "0 8px 24px rgba(244, 67, 54, 0.4)",
                              }}
                            >
                              <CallEndIcon fontSize="large" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Slide>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Tooltip title={videoEnabled ? "Turn Off Camera" : "Start Video Call"}>
                        <IconButton
                          onClick={videoEnabled ? toggleCamera : startVideoCall}
                          disabled={isConnecting}
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: videoEnabled ? "primary.main" : "success.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: videoEnabled ? "primary.dark" : "success.dark",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                          }}
                        >
                          {videoEnabled ? <VideocamIcon /> : <VideocamIcon />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}>
                        <IconButton
                          onClick={toggleMicrophone}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: audioEnabled ? "primary.main" : "error.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: audioEnabled ? "primary.dark" : "error.dark",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
                          }}
                        >
                          {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="End Call">
                        <IconButton
                          onClick={() => endCall(true)}
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: "error.dark",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "0 8px 24px rgba(244, 67, 54, 0.4)",
                          }}
                        >
                          <CallEndIcon />
                        </IconButton>
                      </Tooltip>

                      {videoEnabled && (
                        <Tooltip title="Switch Camera">
                          <IconButton
                            onClick={() => {
                              // Add camera switching logic here if needed
                              toast.success("Camera switching not implemented yet");
                            }}
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "rgba(255,255,255,0.1)",
                              color: "white",
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.2)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease-in-out",
                              border: "1px solid rgba(255,255,255,0.3)",
                            }}
                          >
                            <FlipCameraIosIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  )}
                </Stack>

                {/* Connection Quality Indicator */}
                {videoEnabled && (
                  <Fade in={true}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                        p: 1,
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: getConnectionStatusColor(),
                          animation: "pulse 2s infinite",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {isConnecting ? "Establishing connection..." : `Connection ${connectionStatus}`}
                      </Typography>
                    </Box>
                  </Fade>
                )}

                {/* Call Duration Timer */}
                {videoEnabled && !isConnecting && (
                  <CallTimer />
                )}
              </CardContent>
            </Card>
          </Fade>
        )}
      </Box>

      <SongList />

      {currentSong && (
        <Box sx={{ mt: 4 }}>
          <PlayerControls />
        </Box>
      )}
    </>
  );
};

// Call Timer Component
const CallTimer = () => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Fade in={true}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Chip
          label={`Call Duration: ${formatTime(callDuration)}`}
          size="small"
          sx={{
            bgcolor: "rgba(76, 175, 80, 0.2)",
            color: "#4caf50",
            fontWeight: "bold",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            fontSize: "0.75rem",
          }}
        />
      </Box>
    </Fade>
  );
};

export default MusicPlayer;