import express from 'express';
import eventsController from '../controllers/events.controller.js';
import Event from '../models/Event.model.js';
import validate from '../middlewares/validate.middleware.js';
import validateJwt from '../middlewares/validateJwt.middleware.js';
import checkID from '../middlewares/checkID.middleware.js';
import { eventSchema } from '../validation/schemas.js';

const eventsRouter = express.Router();

eventsRouter.use(validateJwt);

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.post('/', validate(eventSchema), eventsController.createNewEvent);
eventsRouter.put(
	'/:id',
	validate(eventSchema),
	checkID(Event, 'Event'),
	eventsController.updateEvent
);
eventsRouter.delete(
	'/:id',
	checkID(Event, 'Event'),
	eventsController.deleteEvent
);

export default eventsRouter;
