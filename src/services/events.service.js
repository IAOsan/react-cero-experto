import httpService, { handleError } from './http.service';
const ENDPOINT = '/events';

export async function addEvent(event) {
	try {
		const res = await httpService.post(ENDPOINT, {
			body: JSON.stringify(event),
		});
		return res.data.event;
	} catch (error) {
		handleError(error);
	}
}

export async function getAllEvents() {
	try {
		const res = await httpService.get(ENDPOINT);
		return res.data.events;
	} catch (error) {
		handleError(error);
	}
}

export async function updateEvent(update) {
	const { id, ...rest } = update;
	try {
		const res = await httpService.put(`${ENDPOINT}/${id}`, {
			body: JSON.stringify(rest),
		});
		return res.data.event;
	} catch (error) {
		handleError(error);
	}
}

export async function deleteEvent(id) {
	try {
		await httpService.delete(`${ENDPOINT}/${id}`);
	} catch (error) {
		handleError(error);
	}
}

const service = {
	addEvent,
	getAllEvents,
	updateEvent,
	deleteEvent,
};

export default service;
