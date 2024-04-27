import { Router } from "express";
import {
  cleanRoomController,
  cleanRoomInProcessController,
  activeRoomAfterCleaningController
} from "../controllers/cleanRoomHistory.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.get("/clean-room", verifyTokenMiddleware, cleanRoomController);
router.post("/rooms/clean-in-process", verifyTokenMiddleware, cleanRoomInProcessController);
router.put("/rooms/:room_id/activate-after-cleaning", verifyTokenMiddleware, activeRoomAfterCleaningController);

export default router;
