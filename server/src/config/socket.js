import { Server } from "socket.io";

const clients = new Map();

const allowedOrigins = [
  "https://social-tunes.vercel.app",
  "http://localhost:3000",
  "http://192.168.1.3:3000"
];

export const connectSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    receiveEventFromUser(socket, "register", (payload) => {
      console.log(`${payload.user} connected: ${socket.id}`);
      clients.set(socket.id, {
        user: payload.user,
        socketId: socket.id,
        partner: null,
      });
      sendEventToUser(io, "activeUsers", getActiveClients());
    });

    receiveEventFromUser(socket, "refreshUsers", () => {
      sendEventToUser(io, "activeUsers", getActiveClients());
    });

    receiveEventFromUser(socket, "sendRequest", (payload) => {
      sendBroadcastToUser(socket, payload.to.socketId, "receiveRequest", payload);
      console.log(`Request sent from ${payload.from.user} to ${payload.to.partner}`);
    });

    receiveEventFromUser(socket, "acceptRequest", (payload) => {
      const fromSocketId = socket.id;
      const toSocketId = payload.whom.socketId;

      if (clients.has(fromSocketId)) {
        clients.get(fromSocketId).partner = toSocketId;
      }
      if (clients.has(toSocketId)) {
        clients.get(toSocketId).partner = fromSocketId;
      }

      sendSelfEventToUser(socket, "requestAccepted", payload);
      sendBroadcastToUser(socket, payload.whom.socketId, "requestAccepted", payload);
      console.log(`Request accepted between ${payload.by.partner} and ${payload.whom.user}`);
    });

    receiveEventFromUser(socket, "songSocket", (payload) => {
      console.log("Received song:", payload.song.name, payload.user, payload.partner);
      sendBroadcastToUser(socket, payload.partner.socketId, "songSockett", payload);
    });

    receiveEventFromUser(socket, "togglePlayPause", (payload) => {
      console.log(`Play/Pause toggled: ${payload.isPlaying} by ${socket.id}`);
      const sender = getPartnerSocket(socket.id);

      sendBroadcastToUser(socket, sender.partner, "PlayPause", payload);
    });

    receiveEventFromUser(socket, "leaveSession", (payload) => {
      const { by, partnerId } = payload;

      const sender = getPartnerSocket(socket.id);
      const partner = getPartnerSocket(partnerId);

      if (sender) sender.partner = null;
      if (partner) partner.partner = null;

      sendBroadcastToUser(socket, partnerId, "partnerLeft", {});
    });


    socket.on("disconnect", () => {
      const partnerId = getPartnerSocket(socket.id)?.partner;
      console.log(partnerId);
      clients.delete(socket.id);

      sendBroadcastToUser(socket, partnerId, "partnerLeft", {});
      sendEventToUser(io, "activeUsers", getActiveClients());
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

const sendSelfEventToUser = (socket, event, payload) => {
  socket.emit(event, payload);
  console.log("sendSelfEventToUser-->", event, payload);
};

const sendEventToUser = (io, event, payload) => {
  io.emit(event, payload);
  console.log("sendEventToUser-->", event, payload);
};

const sendBroadcastToUser = (socket, userId, event, payload) => {
  if (userId) {
    socket.broadcast.to(userId).emit(event, payload);
    console.log('sendBroadcastToUser-->', event, userId);
  }
};

const getActiveClients = () => {
  return Array.from(clients.values());
};

const receiveEventFromUser = (socket, event, callback) => {
  socket.on(event, (payload) => {
    console.log("receiveEventFromUser-->", event, payload);

    callback(payload);
  });
};

const isClientConnected = (clientId) => {
  return clients.has(clientId);
};


function getPartnerSocket(socketId) {
  return clients.get(socketId);
}




