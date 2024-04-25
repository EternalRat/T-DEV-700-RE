import express from "express";
import { AuthController } from "../../controllers/auth.controller";
import { JWT } from "../../class/jwt.class";

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/', JWT.authToken, AuthController.getAuthedUser);

export default router;