import Event from '../models/Event.model.js';

async function createNewEvent(req, res) {
	const { id } = req.user;
	try {
		const event = await Event.create(Object.assign({ user: id }, req.body));
		return res.status(201).json({
			status: 'success',
			data: {
				event,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error,
		});
	}
}

async function getAllEvents(req, res) {
	try {
		const events = await Event.find({}).populate('user', 'name');
		return res.status(200).json({
			status: 'success',
			data: {
				events,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error,
		});
	}
}

async function updateEvent(req, res) {
	const { id } = req.params;
	const { document } = req;

	try {
		const isAuthorizated = document.user.toString() === req.user.id;

		if (!isAuthorizated) {
			return res.status(401).json({
				status: 'failed',
				error: {
					message: 'You are not authorized',
				},
			});
		}

		const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		return res.status(200).json({
			status: 'success',
			data: {
				event: updatedEvent,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error: { ...error, reason: error.reason.message },
		});
	}
}

async function deleteEvent(req, res) {
	const { id } = req.params;
	const { document } = req;

	try {
		const isAuthorizated = document.user.toString() === req.user.id;

		if (!isAuthorizated) {
			return res.status(401).json({
				status: 'failed',
				error: {
					message: 'You are not authorized',
				},
			});
		}

		await Event.findByIdAndDelete(id);

		return res.status(200).json({
			status: 'success',
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error: { ...error, reason: error.reason.message },
		});
	}
}

const controllers = {
	createNewEvent,
	getAllEvents,
	updateEvent,
	deleteEvent,
};

export default controllers;
