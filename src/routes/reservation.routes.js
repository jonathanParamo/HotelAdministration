import { Router } from "express";
import {
  createReservationController,
  editReservationController
} from "../controllers/reservation.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post("/create-reservation",verifyTokenMiddleware, createReservationController);
router.put("/edit-reservation",verifyTokenMiddleware, editReservationController);


export default router;
