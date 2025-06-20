// import React, { useContext } from "react";
// import { UserContext } from "../context/userContext";
// import { Box, Typography, Paper, Divider, Button, Stack } from "@mui/material";
// import PlayerControls from "./PlayerControls";
// import SongList from "./SongsList/SongsList";
// import { MusicContext } from "../context/MusicContext";

// const MusicPlayer = () => {
//   const { currentSong } = useContext(MusicContext);
//   const { partner, setPartner, user, socket } = useContext(UserContext);

//   const handleLeave = () => {
//     if (socket && partner?.socketId) {
//       socket.emit("leaveSession", {
//         by: user,
//         partnerId: partner.socketId,
//       });
//     }
//     setPartner([]);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "linear-gradient(to right top, #1a0000, #0f0f0f)",
//           px: 2,
//           py: 4,
//           textAlign: "center",
//         }}
//       >
//         {partner && (
//           <Paper
//             elevation={6}
//             sx={{
//               backgroundColor: "rgba(40, 0, 0, 0.85)",
//               backdropFilter: "blur(6px)",
//               border: "1px solid #ff4c4c88",
//               borderRadius: 4,
//               maxWidth: 600,
//               mx: "auto",
//               mb: 4,
//               px: 3,
//               py: 2,
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 color: "#ff4c4c",
//                 fontWeight: "bold",
//                 textShadow: "0 0 10px #ff4c4c66",
//               }}
//             >
//               🎵 Listening with{" "}
//               <span style={{ color: "#fff" }}>{partner?.partner}</span>
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
//               You're synced and ready to vibe together.
//             </Typography>

//             <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
//               <Button
//                 variant="outlined"
//                 onClick={handleLeave}
//                 sx={{
//                   color: "#ff4c4c",
//                   borderColor: "#ff4c4c",
//                   "&:hover": {
//                     backgroundColor: "rgba(255, 76, 76, 0.1)",
//                   },
//                 }}
//               >
//                 Leave Session
//               </Button>
//             </Stack>

//             <Divider sx={{ backgroundColor: "#333", my: 2 }} />
//           </Paper>
//         )}

//         <SongList />

//         {currentSong && (
//           <Box sx={{ mt: 4 }}>
//             <PlayerControls />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

// export default MusicPlayer;

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { UserContext } from "../context/userContext";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Stack,
  IconButton,
  Avatar,
  Chip,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import { MusicContext } from "../context/MusicContext";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";

const MusicPlayer = () => {
  const { currentSong } = useContext(MusicContext);
  const { partner, setPartner, user, socket } = useContext(UserContext);

  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("online");
  const [incomingCall, setIncomingCall] = useState(null);
  const [showAcceptUI, setShowAcceptUI] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && socket && partner?.socketId) {
        console.log("Sending ICE candidate");
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: partner.socketId,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log("Received remote stream");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.current.connectionState);
      setConnectionStatus(peerConnection.current.connectionState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE connection state:",
        peerConnection.current.iceConnectionState
      );
    };

    return peerConnection.current;
  }, [socket, partner?.socketId]);

  const getLocalStream = async () => {
    try {
      if (!localStream.current) {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = localStream.current;

        console.log("Got local stream");
      }
      return localStream.current;
    } catch (error) {
      console.error("Error getting local stream:", error);
      throw error;
    }
  };

  const addTracksToConnection = (stream, pc) => {
    stream.getTracks().forEach((track) => {
      console.log("Adding track:", track.kind);
      pc.addTrack(track, stream);
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ offer, from }) => {
      try {
        console.log("Incoming call offer from:", from);
        setIncomingCall({ offer, from });
        setShowAcceptUI(true);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleAnswer = async ({ answer, from }) => {
      try {
        console.log("Received answer from:", from);
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("Set remote description from answer");
        }
        setIsConnecting(false);
      } catch (error) {
        console.error("Error handling answer:", error);
        setIsConnecting(false);
      }
    };

    const handleIceCandidate = async ({ candidate, from }) => {
      try {
        console.log("Received ICE candidate from:", from);
        if (
          candidate &&
          peerConnection.current &&
          peerConnection.current.remoteDescription
        ) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
          console.log("Added ICE candidate");
        } else {
          console.warn("ICE candidate received but connection not ready");
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket, createPeerConnection, videoEnabled, audioEnabled]);

  useEffect(() => {
    if (!socket) return;

    const handleDecline = () => {
      toast.error("Your partner declined the call.");
      endCall();
    };

    socket.on("call-declinedd", handleDecline);

    // Cleanup on unmount
    return () => {
      socket.off("call-declinedd", handleDecline);
    };
  }, [socket]);

  const startVideoCall = async () => {
    try {
      console.log("Starting video call");
      setIsConnecting(true);
      setVideoEnabled(true);

      const stream = await getLocalStream();
      const pc = createPeerConnection();

      addTracksToConnection(stream, pc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { offer, to: partner.socketId });
      console.log("Sent offer");
    } catch (error) {
      console.error("Failed to start video call:", error);
      setIsConnecting(false);
      setVideoEnabled(false);
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    try {
      setIsConnecting(true);

      const stream = await getLocalStream();
      const pc = createPeerConnection();
      addTracksToConnection(stream, pc);

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        answer,
        to: incomingCall.from,
      });

      console.log("Sent answer to:", incomingCall.from);
      setShowAcceptUI(false);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeclineCall = () => {
    if (!incomingCall) return;

    socket.emit("call-declined", { to: incomingCall.from });
    setShowAcceptUI(false);
    setIncomingCall(null);
  };

  const toggleVideo = async () => {
    if (!videoEnabled) {
      await startVideoCall();
    } else {
      // Toggle video track
      if (localStream.current) {
        const videoTrack = localStream.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
        }
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    console.log("Ending call");

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStream.current = null;
    }

    if (peerConnection.current) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setVideoEnabled(false);
    setAudioEnabled(true);
    setIsConnecting(false);
    setConnectionStatus("disconnected");
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
                background: "linear-gradient(to right top, #1a0000, #0f0f0f)",
                backdropFilter: "blur(20px)",
                borderRadius: 6,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                overflow: "visible",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={2}
                  mb={3}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 56,
                      height: 56,
                      fontSize: "1.5rem",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                        textAlign: "left",
                        fontSize: {
                          xs: "1.5rem", // Mobile
                          sm: "2rem", // Tablets
                          md: "2.5rem", // Desktop
                        },
                      }}
                    >
                      {partner?.partner}
                    </Typography>

                    <Chip
                      label={isConnecting ? "Connecting..." : connectionStatus}
                      size="small"
                      sx={{
                        bgcolor: getConnectionStatusColor(),
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Stack>

                {/* Video Container */}
                {videoEnabled && (
                  <Box
                    sx={{
                      position: "relative",
                      mb: 3,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "#000",
                      minHeight: 300,
                    }}
                  >
                    {/* Main remote video */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "16px",
                        }}
                      />

                      {/* Picture-in-picture local video */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          width: 180,
                          height: 120,
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "3px solid white",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        }}
                      >
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Controls */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={10}
                  sx={{ mb: 2 }}
                >
                  {showAcceptUI ? (
                    <Box textAlign="center" spacing={10}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        📞 Incoming call
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                      >
                        <IconButton
                          onClick={handleAcceptCall}
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "success.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: "success.dark",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                            position: "relative",
                          }}
                        >
                          <VideocamIcon />
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              top: "110%",
                              color: "success.main",
                              fontWeight: "bold",
                            }}
                          >
                            Accept
                          </Typography>
                        </IconButton>

                        <IconButton
                          onClick={handleDeclineCall}
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
                            position: "relative",
                          }}
                        >
                          <CallEndIcon />
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              top: "110%",
                              color: "error.main",
                              fontWeight: "bold",
                            }}
                          >
                            Decline
                          </Typography>
                        </IconButton>
                      </Stack>
                    </Box>
                  ) : (
                    <>
                      <IconButton
                        onClick={toggleVideo}
                        disabled={isConnecting}
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: videoEnabled ? "error.main" : "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: videoEnabled
                              ? "error.dark"
                              : "primary.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        {videoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
                      </IconButton>

                      <IconButton
                        onClick={endCall}
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
                        }}
                      >
                        <CallEndIcon />
                      </IconButton>
                    </>
                  )}
                </Stack>
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

export default MusicPlayer;
