import { Router } from "express";
import { signupController, signinController } from "../controllers/user.controler.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Jonathan 👋");
});

router.post("/signup",  signupController);
router.post("/signin", signinController);

export default router;
