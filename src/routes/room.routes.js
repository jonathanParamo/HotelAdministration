import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { createRoomController } from "../controllers/room.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post("/create-room",verifyTokenMiddleware, isAdmin, createRoomController);

export default router;