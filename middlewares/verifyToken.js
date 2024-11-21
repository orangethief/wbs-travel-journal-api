import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const verifyTokenMiddleware = asyncHandler(async(req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorResponse('Unauthorized', 401));
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ErrorResponse('JWT secret is not defined', 500));
  }
  const decodedToken = jwt.verify(token, secret)
  req.userId = decodedToken.id;
  next();
});

export default verifyTokenMiddleware;