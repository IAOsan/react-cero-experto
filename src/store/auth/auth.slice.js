import { createSlice } from '@reduxjs/toolkit';
import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import {
	loadingStatus,
	successStatus,
	errorStatus,
	setError,
} from '../ui/ui.slice';

const slice = createSlice({
	name: '[auth]',
	initialState: {
		checking: true,
		isAuth: false,
		user: null,
	},
	reducers: {
		logged_in(state, { payload }) {
			state.checking = false;
			state.isAuth = true;
			state.user = payload;
		},
		logged_out(state) {
			state.isAuth = false;
			state.user = null;
		},
		checking_auth_started(state) {
			state.checking = true;
		},
		checking_auth_finished(state) {
			state.checking = false;
		},
	},
});

const { logged_in, logged_out, checking_auth_started, checking_auth_finished } =
	slice.actions;
export default slice.reducer;

/* -------------------------------------------------------------------------- */
/*                               action creators                              */
/* -------------------------------------------------------------------------- */
export const registerEmailAndPassword = (user) => async (dispatch) => {
	dispatch(loadingStatus());
	try {
		const res = await userService.register(user);
		dispatch(successStatus());
		dispatch(logged_in(res));
	} catch (error) {
		dispatch(errorStatus());
		dispatch(setError({ register: error }));
	}
};

export const loginEmailAndPassword = (user) => async (dispatch) => {
	dispatch(loadingStatus());
	try {
		const res = await authService.login(user);
		dispatch(successStatus());
		dispatch(logged_in(res));
	} catch (error) {
		dispatch(errorStatus());
		dispatch(setError({ login: error }));
	}
};

export const logout = () => (dispatch) => {
	try {
		authService.logout();
		dispatch(logged_out());
	} catch (error) {
		dispatch(setError(error));
	}
};

export const checkAuth = () => async (dispatch) => {
	const user = await authService.getCurrentUser();

	dispatch(checking_auth_started());
	if (user) {
		dispatch(logged_in(user));
	}
	dispatch(checking_auth_finished());
};

/* -------------------------------------------------------------------------- */
/*                                  selectors                                 */
/* -------------------------------------------------------------------------- */
export const selectAuthState = (state) => state.auth;
