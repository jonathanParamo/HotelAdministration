import { Router } from "express";
import {
  createReservationController,
  editReservationController,
  cancelReservationController
} from "../controllers/reservation.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post("/create-reservation",verifyTokenMiddleware, createReservationController);
router.put("/edit-reservation",verifyTokenMiddleware, editReservationController);
router.delete("/cancel-reservation",verifyTokenMiddleware, cancelReservationController);

export default router;
