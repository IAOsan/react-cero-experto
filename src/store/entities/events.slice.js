import { createSlice } from '@reduxjs/toolkit';
import { mapToList } from '../normalize';

const slice = createSlice({
	name: '[events]',
	initialState: {
		list: {},
		active: null,
	},
	reducers: {
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
});

const {
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
export const addEvent = event_added;

export const selectActiveEvent = event_active_selected;

export const clearActiveEvent = event_active_cleared;

export const editEvent = event_edited;

export const deleteEvent = event_deleted;

/* -------------------------------------------------------------------------- */
/*                                  selectors                                 */
/* -------------------------------------------------------------------------- */
const selectEventsState = (state) => state.entities.events;

export const selectEventsList = (state) =>
	mapToList(selectEventsState(state).list, parseDatesToView);

export const selectActiveEvt = (state) => selectEventsState(state).active;
