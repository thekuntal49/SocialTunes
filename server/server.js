import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db/db.js";
import musicRoutes from "./src/routes/musicRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { connectSocket } from "./src/db/socket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/music", musicRoutes);
app.use("/api/users", userRoutes);

// Socket.IO handling
connectSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
