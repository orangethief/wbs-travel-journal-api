import './db/index.js';
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/postsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routes/authRouter.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/posts', postsRouter);
app.use('/auth', authRouter);
app.use('*', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on port : ${port}`));
