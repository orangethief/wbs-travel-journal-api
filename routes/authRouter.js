import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import { userSchema, signinSchema } from '../joi/schemas.js';
import { signUp, signIn, signOut, me } from '../controllers/auth.js';
import verifyTokenMiddleware from '../middlewares/verifyToken.js';

const authRouter = Router();

authRouter.post('/signup', validateJOI(userSchema), signUp);

authRouter.post('/signin', validateJOI(signinSchema), signIn);

authRouter.get('/me', verifyTokenMiddleware, me);

authRouter.delete('/signout', signOut);

export default authRouter;


