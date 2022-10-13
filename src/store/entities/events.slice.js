import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { mapToList, listToMap } from '../normalize';
import eventsService from '../../services/events.service';

const initialState = {
	list: {},
	active: null,
};

const slice = createSlice({
	name: '[events]',
	initialState,
	reducers: {
		events_loaded(state, { payload }) {
			state.list = listToMap(payload);
		},
		event_added(state, { payload }) {
			state.list[payload.id] = payload;
		},
		event_active_selected(state, { payload }) {
			state.active = state.list[payload];
		},
		event_active_cleared(state) {
			state.active = null;
		},
		event_edited(state, { payload }) {
			const eventToUpdate = state.list[payload.id];
			state.list[payload.id] = { ...eventToUpdate, ...payload };
		},
		event_deleted(state, { payload }) {
			state.active = null;
			delete state.list[payload];
		},
	},
	extraReducers: (builder) => {
		builder.addCase('[auth]/logged_out', (state) => {
			Object.keys(initialState).forEach((k) => {
				state[k] = initialState[k];
			});
		});
	},
});

const {
	events_loaded,
	event_added,
	event_active_selected,
	event_active_cleared,
	event_edited,
	event_deleted,
} = slice.actions;
export default slice.reducer;

function parseDatesToView(event) {
	return {
		...event,
		start: new Date(event.start),
		end: new Date(event.end),
	};
}

/* -------------------------------------------------------------------------- */
/*                               action creators                              */
/* -------------------------------------------------------------------------- */

export const loadEvents = () => async (dispatch) => {
	try {
		const res = await eventsService.getAllEvents();
		dispatch(events_loaded(res));
	} catch (error) {
		console.error('error loading events', error);
		toast.error(
			'It seems that something goes wrong, could not load events, please try later!',
			{
				autoClose: false,
			}
		);
	}
};

export const addEvent = (event) => async (dispatch, getState) => {
	const { id, name } = getState().auth.user;
	try {
		const res = await eventsService.addEvent(event);
		dispatch(
			event_added({
				...res,
				user: {
					id,
					name,
				},
			})
		);
	} catch (error) {
		console.error('Error adding new event', error);
		toast.error(
			'It seems that something goes wrong, could not add event, please try later!'
		);
	}
};

export const selectActiveEvent = event_active_selected;

export const clearActiveEvent = event_active_cleared;

export const editEvent = (update) => async (dispatch) => {
	try {
		await eventsService.updateEvent(update);
		dispatch(event_edited(update));
		toast.success('Event edited successfuly 🙌');
	} catch (error) {
		toast.error('You are not authorized to edit this event!');
	}
};

export const deleteEvent = (id) => async (dispatch, getState) => {
	try {
		await eventsService.deleteEvent(id);
		dispatch(event_deleted(id));
		toast.success('Event deleted!');
	} catch (error) {
		toast.error('You are not authorized to delete this event!');
	}
};

/* -------------------------------------------------------------------------- */
/*                                  selectors                                 */
/* -------------------------------------------------------------------------- */

export const selectEventsState = (state) => {
	const { list, active } = state.entities.events;
	return {
		list: mapToList(list, parseDatesToView),
		active,
	};
};
