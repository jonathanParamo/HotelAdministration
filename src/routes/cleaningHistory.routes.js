import { Router } from "express";
import {
  cleanRoomController
} from "../controllers/cleanRoomHistory.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.get("/clean-room",verifyTokenMiddleware, cleanRoomController);

export default router;