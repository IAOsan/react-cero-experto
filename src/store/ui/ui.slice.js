import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: '[ui]',
	initialState: {
		status: 'idle',
		error: null,
		isModalOpen: false,
	},
	reducers: {
		modal_opened(state) {
			state.isModalOpen = true;
		},
		modal_closed(state) {
			state.isModalOpen = false;
		},
	},
});

const { modal_opened, modal_closed } = slice.actions;
export default slice.reducer;

/* -------------------------------------------------------------------------- */
/*                               action creators                              */
/* -------------------------------------------------------------------------- */
export const openModal = modal_opened;

export const closeModal = modal_closed;

/* -------------------------------------------------------------------------- */
/*                                  selectors                                 */
/* -------------------------------------------------------------------------- */
export const selectUiState = (state) => state.ui;
