import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoading: false,
	error: null,
};

const slice = createSlice({
	name: '[ui]',
	initialState,
	reducers: {
		load_started(state) {
			state.isLoading = true;
		},
		load_finished(state) {
			state.isLoading = false;
		},
		error_added(state, action) {
			state.error = action.payload;
		},
		error_removed(state) {
			state.error = null;
		},
	},
});

const { load_started, load_finished, error_added, error_removed } =
	slice.actions;
export default slice.reducer;

export const startLoading = load_started();
export const finishLoading = load_finished();
export const addError = error_added;
export const removeError = error_removed();
