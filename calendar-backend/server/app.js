import './config/config.js';
import './db/mongodb.js';
import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json()); //Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
// routes
app.use('/', mainRouter);

export default app;
