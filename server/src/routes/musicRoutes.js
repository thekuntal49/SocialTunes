import express from "express";
import { createSong, getSongs } from "../controllers/musicController.js";

const router = express.Router();

router.post("/create", createSong);
router.get("/", getSongs);

export default router;
