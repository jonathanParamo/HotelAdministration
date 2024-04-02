import { Router } from "express";
import { signupController, signinController } from "../controllers/user.controler.js";
import { recoveryPassword } from "../controllers/mail.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Jonathan 👋");
});

router.post("/signup",  signupController);
router.post("/signin", signinController);
router.post("/forgot-password", recoveryPassword);

export default router;
