import express from 'express';
import auth from './auth.route.js';
import events from './events.route.js';

const mainRouter = express.Router();

mainRouter.use('/api/v1/auth', auth);
mainRouter.use('/api/v1/events', events);

export default mainRouter;
