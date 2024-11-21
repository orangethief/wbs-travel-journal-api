import { isValidObjectId } from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userSchema, signinSchema } from '../joi/schemas.js';


const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
httpOnly: true,
sameSite: isProduction ? 'None' : 'Lax',
secure: isProduction
};


export const signUp = asyncHandler(async(req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return next(new ErrorResponse('Invalid input data', 400, error.details));
    }

  const existingUser = await User.findOne({email: value.email});
  if (existingUser) {
    return next(new ErrorResponse('User already exists', 400));
  }


  const hashedPassword = await bcrypt.hash(value.password, 10);

  const newUser = {
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    password: hashedPassword,
  };

  const user = await User.create(newUser);


  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ErrorResponse('JWT secret is not defined', 500));
  }
  const payload = {id: user._id};
  const tokenOptions = { expiresIn: '7d'};
  const token = jwt.sign(payload, secret, tokenOptions);


res.cookie('token', token, cookieOptions);
res.status(201).json({ success: true, message: "Welcome to the plattform" });

})

export const signIn = asyncHandler(async(req, res, next) => {
  const { error, value } = signinSchema.validate(req.body);
  if (error) {
    return next(new ErrorResponse('Invalid input data', 400, error.details))
  }

  const existingUser = await User.findOne({ email: value.email}).select('+password');
  if (!existingUser) {
    return next(new ErrorResponse('User not found', 404));
  }
  const isPasswordValid = await bcrypt.compare(value.password, existingUser.password)
  if (!isPasswordValid) {
    return next(new ErrorResponse('Invalid password', 401))
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ErrorResponse('JWT secret is not defined', 500)); }

  const payload = {id: existingUser._id};
  const tokenOptions = { expiresIn: '7d'};
  const token = jwt.sign(payload, secret, tokenOptions);


res.cookie('token', token, cookieOptions);
res.status(200).json({ success: true, message: "Welcome back!" });
}
)

export const signOut = asyncHandler(async( req, res, next) => {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ success: true, message: "Goodbye!"});
})

export const me = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
})