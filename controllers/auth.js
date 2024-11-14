import { isValidObjectId } from 'mongoose';
import Post from '../models/Post.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { userSchema, signinSchema } from '../joi/schemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;


export const signUp = asyncHandler(async(req, res, next) => {
const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({
    message: 'Invalid input data',
    details: error.details,
  });
}

const existingUser = await User.findOne({ email: value.email});
if (existingUser) {
  return res.status(400).json({
    message: 'User already exists with this email adress',
  })
}


const hashedPassword = await bcrypt.hash(value.password, saltRounds);

const newUser = {
  firstName: value.firstName,
  lastName: value.lastName,
  email: value.email,
  password: hashedPassword,
};

const user = await User.create(newUser);


const secret = process.env.JWT_SECRET;
const payload = {id};
const tokenOptions = { expiresIn: '7d'};
const token = jwt.sign(payload, secret, tokenOptions);
res.json({ token });

})