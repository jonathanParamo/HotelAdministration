import { Router } from "express";
import { signupController } from "../controllers/user.controler.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Andres 👋");
});

router.post("/signup",  signupController);

export default router;
