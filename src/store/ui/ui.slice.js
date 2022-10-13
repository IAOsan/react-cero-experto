import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	status: 'idle',
	error: null,
	isModalOpen: false,
};

const slice = createSlice({
	name: '[ui]',
	initialState,
	reducers: {
		modal_opened(state) {
			state.isModalOpen = true;
		},
		modal_closed(state) {
			state.isModalOpen = false;
		},
		status_loaded(state) {
			state.status = 'loading';
		},
		status_succeed(state) {
			state.status = 'success';
		},
		status_failed(state) {
			state.status = 'error';
		},
		error_received(state, { payload }) {
			state.error = payload;
		},
		error_cleared(state) {
			state.error = null;
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
	modal_opened,
	modal_closed,
	status_loaded,
	status_succeed,
	status_failed,
	error_received,
	error_cleared,
} = slice.actions;
export default slice.reducer;

/* -------------------------------------------------------------------------- */
/*                               action creators                              */
/* -------------------------------------------------------------------------- */
export const openModal = modal_opened;

export const closeModal = modal_closed;

export const loadingStatus = status_loaded;

export const successStatus = status_succeed;

export const errorStatus = status_failed;

export const setError = error_received;

export const clearError = error_cleared;

/* -------------------------------------------------------------------------- */
/*                                  selectors                                 */
/* -------------------------------------------------------------------------- */
export const selectUiState = (state) => state.ui;
