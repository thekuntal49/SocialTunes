import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import MusicPlayer from "./MusicPlayer";
import UserList from "./UserList";
import { UserName } from "./UserName";
import { Snackbar, Alert, Button, Stack } from "@mui/material";

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
                >
                  <Alert
                    severity="info"
                    sx={{
                      backgroundColor: "#2a0000",
                      color: "#fff",
                      border: "1px solid #ff4c4c",
                      boxShadow: "0 0 10px #ff4c4c66",
                      width: "100%",
                    }}
                    action={
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={handleAccept}
                          sx={{
                            color: "#fff",
                            border: "1px solid #00e676",
                            "&:hover": {
                              backgroundColor: "#00e67633",
                            },
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          onClick={handleDecline}
                          sx={{
                            color: "#fff",
                            border: "1px solid #ff1744",
                            "&:hover": {
                              backgroundColor: "#ff174433",
                            },
                          }}
                        >
                          Decline
                        </Button>
                      </Stack>
                    }
                  >
                    🎧 <strong>{request[0].user}</strong> wants to vibe with
                    you!
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
