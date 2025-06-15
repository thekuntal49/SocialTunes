import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import MusicPlayer from "./MusicPlayer";
import UserList from "./UserList";
import { UserName } from "./UserName";
import { Snackbar, Alert, Button, Stack, Typography, Box } from "@mui/material";

const DuoPlayer = () => {
  const [request, setRequest] = useState(null);
  const { user, partner, setPartner, socket } = useContext(UserContext);

  useEffect(() => {
    if (socket) {
      socket.on("receiveRequest", ({ from, to }) => {
        setRequest([from, to]);
      });

      socket.on("requestAccepted", ({ by, whom }) => {
        if (user === by.partner) {
          setPartner({ partner: whom.user, socketId: whom.socketId });
        } else if (user === whom.user) {
          setPartner({ partner: by.partner, socketId: by.socketId });
        }

        setRequest(null);
      });
    }
  }, [socket, request, setPartner]);

  const handleAccept = () => {
    if (socket && request.length > 1) {
      socket.emit("acceptRequest", {
        by: {
          partner: request[1].partner,
          socketId: request[1].socketId,
        },
        whom: {
          user: request[0].user,
          socketId: request[0].socketId,
        },
      });

      setRequest(null);
    }
  };

  const handleDecline = () => {
    setRequest(null);
  };

  return (
    <>
      {!user ? (
        <UserName />
      ) : (
        <div style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
          {partner.length < 1 ? (
            <>
              <UserList />
              {request && (
                <Snackbar
                  open={true}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    px: 2,
                  }}
                >
                  <Alert
                    icon={false}
                    severity="info"
                    sx={{
                      background: "#1a0000",
                      color: "#fff",
                      border: "1px solid #ff4c4c",
                      boxShadow: "0 0 15px rgba(255, 76, 76, 0.4)",
                      width: "fit",
                      maxWidth: 600,
                      mx: "auto",
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        🎧 <strong>{request[0].user}</strong> wants to vibe with
                        you.
                      </Typography>

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Button
                          size="small"
                          onClick={handleAccept}
                          sx={{
                            color: "#00e676",
                            border: "1px solid #00e676",
                            fontWeight: 500,
                            px: 2,
                            "&:hover": {
                              backgroundColor: "#00e67622",
                            },
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          onClick={handleDecline}
                          sx={{
                            color: "#ff1744",
                            border: "1px solid #ff1744",
                            fontWeight: 500,
                            px: 2,
                            "&:hover": {
                              backgroundColor: "#ff174422",
                            },
                          }}
                        >
                          Decline
                        </Button>
                      </Box>
                    </Box>
                  </Alert>
                </Snackbar>
              )}
            </>
          ) : (
            <MusicPlayer />
          )}
        </div>
      )}
    </>
  );
};

export default DuoPlayer;
