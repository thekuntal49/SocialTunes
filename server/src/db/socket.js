const activeUsers = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("register", ({ user }) => {
      if (user) {
        activeUsers.set(socket.id, { user, socketId: socket.id });
        io.emit("activeUsers", Array.from(activeUsers.values()));
        console.log(`✅ User registered: ${user}`);
      }
    });

    socket.on("refreshUsers", () => {
      socket.emit("activeUsers", Array.from(activeUsers.values()));
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

    socket.on("songSocket", (song) => {
      console.log("Received song:", song);
      // Emit the song to all connected clients
      io.emit("songSocket", song);
    });
    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      io.emit("activeUsers", Array.from(activeUsers.values()));
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
