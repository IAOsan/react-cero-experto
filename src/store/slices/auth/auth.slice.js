import { createSlice } from '@reduxjs/toolkit';
import {
	startLoading,
	finishLoading,
	addError,
	removeError,
} from '../ui/ui.slice';
import { clearNotes } from '../notes/notes.slice';
import * as authService from '../../../services/auth.service';

const initialState = {
	user: null,
	isAuth: false,
};

const slice = createSlice({
	name: '[auth]',
	initialState,
	reducers: {
		logged_in(state, { payload }) {
			state.user = payload;
			state.isAuth = true;
		},
		logged_out(state, action) {
			state.user = null;
			state.isAuth = false;
		},
	},
});

export default slice.reducer;

const { logged_in, logged_out } = slice.actions;

export const login = logged_in;

export const loginWithEmailPassWord = (data) => async (dispatch) => {
	dispatch(startLoading);
	dispatch(removeError);
	try {
		const user = await authService.loginEmailPassword(data);
		dispatch(logged_in(user));
	} catch (error) {
		dispatch(addError(error));
	} finally {
		dispatch(finishLoading);
	}
};

export const loginWithGoogle = async (dispatch) => {
	dispatch(removeError);
	try {
		const user = await authService.loginGoogle();
		dispatch(logged_in(user));
	} catch (error) {
		dispatch(addError(error));
	}
};

export const registerWithEmailPassword = (data) => async (dispatch) => {
	dispatch(startLoading);
	dispatch(removeError);
	try {
		const user = await authService.registerEmailPassword(data);
		dispatch(logged_in(user));
	} catch (error) {
		dispatch(addError(error));
	} finally {
		dispatch(finishLoading);
	}
};

export const logout = async (dispatch) => {
	await authService.logout();
	dispatch(logged_out());
	dispatch(clearNotes);
};
