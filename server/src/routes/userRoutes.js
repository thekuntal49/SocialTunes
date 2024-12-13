import express from "express";
import { getActiveUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getActiveUsers);

export default router;
