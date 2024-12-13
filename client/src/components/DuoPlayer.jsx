import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import MusicPlayer from "./MusicPlayer";
import UserList from "./UserList";
import {UserName} from "./UserName";
import { Snackbar, Button } from "@mui/material";

const DuoPlayer = () => {
  const [isController, setIsController] = useState(false);
  const [request, setRequest] = useState(null);
  const { user, partner, setPartner, socket } = useContext(UserContext);

  useEffect(() => {
    if (socket) {
      socket.on("receiveRequest", ({ from, to }) => {
        setRequest([from, to]); // Store the request details
      });

      socket.on("requestAccepted", ({ by, whom }) => {
        // Check if the logged-in user is `by` or `whom`
        if (user === by.partner) {
          // If this user is the one who accepted the request
          setPartner({ partner: whom.user });
          whom.user;
        } else if (user === whom.user) {
          // If this user is the one who initiated the request
          setPartner({ partner: by.partner });
          by.partner;
        }
        "Partner set:", partner;
        setRequest(null);
      });
    }
  }, [socket, request, setPartner]);

  const handleAccept = () => {
    if (socket && request.length > 1) {
      socket.emit("acceptRequest", {
        by: {
          partner: request[1].partner, // The accepting user (request receiver)
          socketId: request[1].socketId,
        },
        whom: {
          user: request[0].user, // The user who made the request
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
            <MusicPlayer
              partner={partner}
              isController={isController}
              setIsController={setIsController}
            />
          )}
        </div>
      )}
    </>
  );
};

export default DuoPlayer;
