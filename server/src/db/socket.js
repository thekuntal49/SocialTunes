const activeUsers = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("register", ({ user }) => {
      if (user) {
        activeUsers.set(socket.id, { user, socketId: socket.id });
        console.log(Array.from(activeUsers.values()));

        io.emit("activeUsers", Array.from(activeUsers.values()));
        console.log(`✅ User registered: ${user}`);
      }
    });

    socket.on("refreshUsers", () => {
      io.emit("activeUsers", Array.from(activeUsers.values()));
    });

    socket.on("sendRequest", ({ from, to }) => {
      io.to(to.socketId).emit("receiveRequest", { from, to });
      console.log(`🔔 Request sent from ${from.user} to ${to.partner}`);
    });

    socket.on("acceptRequest", ({ by, whom }) => {
      io.to(whom.socketId).emit("requestAccepted", { by, whom });
      io.to(by.socketId).emit("requestAccepted", { by, whom });
      console.log(`✅ Request accepted between ${by.partner} and ${whom.user}`);
    });

    socket.on("songSocket", ({ song, user, partner }) => {
      console.log("Received song:", song, user, partner);

      if (partner.socketId) {
        io.to(partner.socketId).emit("songSockett", { song, user, partner });
      } else {
        console.log("bhad me jaye");
      }
    });

    socket.on("togglePlayPause", ({ isPlaying }) => {
      console.log(`🎵 Play/Pause toggled: ${isPlaying} by ${socket.id}`);
    
      // Broadcast the play/pause state to all active users or a specific partner
      socket.broadcast.emit("PlayPause", { isPlaying });
    
      // If you want to send it only to a specific partner:
      // io.to(partnerSocketId).emit("PlayPause", { isPlaying });
    });

    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      io.emit("activeUsers", Array.from(activeUsers.values()));
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
