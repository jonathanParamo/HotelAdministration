import { Router } from "express";
import { createReservationController } from "../controllers/reservation.controller.js";
import { verifyTokenMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post("/create-reservation",verifyTokenMiddleware, createReservationController);

export default router;
