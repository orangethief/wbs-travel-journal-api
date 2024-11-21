import { isValidObjectId } from 'mongoose';
import Post from '../models/Post.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('author');
  res.json(posts);
});

export const createPost = asyncHandler(async (req, res, next) => {
  const { body, userId } = req;
  const newPost = await  Post.create({ ...body,
    author: userId,
   }).populate('author');
  res.status(201).json(newPost);
});

export const getSinglePost = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
  const post = await Post.findById(id).populate('author');
  if (!post) throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
  res.send(post);
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const {
    body,
    params: { id },
    userId
  } = req;
  if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
  const updatedPost = await Post.findById(id).populate('author');
  if (!updatedPost) throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
  if (updatedPost.author._id.toString() !== userId)
    throw new ErrorResponse('You are not allowed to update this post', 403);
  updatedPost.set(body);
  await updatedPost.save();
  res.json(updatedPost);
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    userId
  } = req;
  if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
  const deletedPost = await Post.findById(id).populate('author');
  if (!deletedPost) throw new Error(`Post with id of ${id} doesn't exist`);
  if (deletedPost.author._id.toString() !== userId)
    throw new ErrorResponse('You are not allowed to delete this post', 403);
  await Post.findByIdAndDelete(id);
  res.json({ success: `Post with id of ${id} was deleted` });
});
