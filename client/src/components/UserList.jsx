import React, { useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserContext } from "../context/userContext";

const UserList = () => {
  const { activeUsers, isUserLoading, refreshUsers, socket, user } =
    useContext(UserContext);

  const handleRequest = (u) => {
    if (socket) {
      socket.emit("sendRequest", {
        to: { partner: u.user, socketId: u.socketId },
        from: { user, socketId: socket.id },
      });
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          ✨ Active Partners ({user})
        </Typography>
        <IconButton color="primary" onClick={refreshUsers}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <List>
        {!isUserLoading ? (
          activeUsers.length > 0 ? (
            activeUsers.map((user) => (
              <ListItem
                key={user.socketId}
                disableGutters
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={`🔰 ${user.user}`} />
                <Button variant="outlined" onClick={() => handleRequest(user)}>
                  Request
                </Button>
              </ListItem>
            ))
          ) : (
            <ListItemText primary="🚫 No partner available now!" />
          )
        ) : (
          <ListItemText primary="Loading..." />
        )}
      </List>
    </Box>
  );
};

export default UserList;
