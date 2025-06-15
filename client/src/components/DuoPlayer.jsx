import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import MusicPlayer from "./MusicPlayer";
import UserList from "./UserList";
import { UserName } from "./UserName";
import { Snackbar, Button } from "@mui/material";

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
        <div
          style={{ padding: "1rem", backgroundColor: "#1e1e1e", color: "#fff" }}
        >
          {partner.length < 1 ? (
            <>
              <UserList />
              {request && (
                <Snackbar
                  open={true}
                  message={`${request[0].user} is requesting to pair with you.`}
                  action={
                    <>
                      <Button
                        color="secondary"
                        size="small"
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>
                      <Button
                        color="primary"
                        size="small"
                        onClick={handleDecline}
                      >
                        Decline
                      </Button>
                    </>
                  }
                />
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
