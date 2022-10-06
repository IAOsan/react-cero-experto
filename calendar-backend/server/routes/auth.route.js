import express from 'express';
import authController from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../validation/schemas.js';
import validate from '../middlewares/validate.middleware.js';
import validateJwt from '../middlewares/validateJwt.middleware.js';

const authRouter = express.Router();

authRouter.post('/', validate(loginSchema), authController.login);
authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.get('/renew', validateJwt, authController.renew);

export default authRouter;
