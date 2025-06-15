import React, { useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";

const UserList = () => {
  const { activeUsers, isUserLoading, refreshUsers, socket, user } =
    useContext(UserContext);

  const handleRequest = (u) => {
    if (socket) {
      socket.emit("sendRequest", {
        to: { partner: u.user, socketId: u.socketId },
        from: { user, socketId: socket.id },
      });
      toast.success(`Request sent to ${u.user}`);
      // const loadingToastId = toast.loading("Waiting for response...", {
      //   autoClose: false,
      // });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to right bottom, #1a0000, #0f0f0f)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "rgba(30, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          width: "100%",
          maxWidth: 500,
          color: "#fff",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleAltIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Active Partners
            </Typography>
          </Box>
          <IconButton onClick={refreshUsers} sx={{ color: "#ff4c4c" }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
          Hi <strong>{user}</strong>, choose someone to vibe together 🎵
        </Typography>

        <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
          {isUserLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={28} sx={{ color: "#ff4c4c" }} />
            </Box>
          ) : activeUsers.length > 0 ? (
            activeUsers.map((u) => (
              <ListItem
                key={u.socketId}
                disableGutters
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#2a0000",
                  borderRadius: "10px",
                  mb: 1,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#3a0000",
                  },
                }}
              >
                <ListItemText
                  primary={u.user}
                  primaryTypographyProps={{ sx: { color: "#fff" } }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#ff4c4c",
                    color: "#ff4c4c",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#ff4c4c",
                      color: "#fff",
                    },
                  }}
                  onClick={() => handleRequest(u)}
                >
                  Send Request
                </Button>
              </ListItem>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={4}
              color="#bbb"
              textAlign="center"
            >
              <HourglassBottomIcon sx={{ fontSize: "3rem", mb: 1 }} />
              <Typography variant="body1">
                No partner available right now.
              </Typography>
              <Typography variant="body2">
                Hit refresh or wait a moment...
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default UserList;
