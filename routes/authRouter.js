import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost
} from '../controllers/posts.js';
import { userSchema, signinSchema } from '../joi/schemas.js';

const authRouter = Router();

authRouter.route('/signup').post(validateJOI(userSchema), signUp);

authRouter.route('/signin').post(validateJOI(signinSchema), signIn);

authRouter.route('/me').get();

export default authRouter;


