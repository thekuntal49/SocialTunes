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
} from "@mui/material";
import { MusicContext } from "../context/MusicContext";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PersonIcon from "@mui/icons-material/Person";
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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStream = useRef(null);

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
        config: servers,
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
                        muted={false}
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
                        onClick={startVideoCall}
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
