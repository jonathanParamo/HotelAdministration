import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createRoomController,
  editRoomController,
  deleteRoomController,
} from "../controllers/room.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post("/create-room",verifyTokenMiddleware, isAdmin, createRoomController);
router.put("/edit-room",verifyTokenMiddleware, isAdmin, editRoomController);
router.delete("/delete-room",verifyTokenMiddleware, isAdmin, deleteRoomController);

export default router;