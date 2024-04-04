import { Router } from "express";
import { signupController, signinController } from "../controllers/user.controler.js";
import { recoveryPassword } from "../controllers/mail.controller.js";
import { resetPassword } from "../controllers/reset-password.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello (☞ﾟヮﾟ)☞ Jonathan P. 👋");
});

router.post("/signup",  signupController);
router.post("/signin", signinController);
router.post("/forgot-password", recoveryPassword);
router.post("/reset-password", resetPassword);

export default router;

