import 'vitest';
import '@testing-library/jest-dom';
import reducer, {
	initialState,
	logged_in,
	logged_out,
	registerWithEmailPassword,
	loginWithEmailPassWord,
	logout,
} from '../../store/slices/auth/auth.slice';
import { setupStore } from '../../store/store.config';
import { clearAllAcounts } from '../test-utils';
import {
	loginEmailPassword,
	registerEmailPassword,
} from '../../services/auth.service';

const user = {
	name: 'test user',
	email: 'hola@mail.com',
	password: '123456',
	confirmPassword: '123456',
};

describe('Auth reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should be able to login', () => {
		const result = reducer(undefined, logged_in(user));

		expect(result).toEqual({ user, isAuth: true });
	});

	it('should be able to logout', () => {
		const state = {
			user,
			isAuth: true,
		};

		const result = reducer(state, logged_out());

		expect(result).toEqual({ user: null, isAuth: false });
	});
});

describe('Auth actions', () => {
	beforeEach(async () => {
		await clearAllAcounts();
	});

	it('should be able to register a user with email and password', async () => {
		const store = setupStore();

		await store.dispatch(registerWithEmailPassword(user));

		expect(store.getState().auth.user).toEqual({
			name: user.name,
			email: user.email,
			uid: expect.any(String),
		});
	});

	it('should be able to login with email and password', async () => {
		await registerEmailPassword(user);

		const store = setupStore();

		await store.dispatch(loginWithEmailPassWord(user));

		expect(store.getState().auth.user).toEqual({
			name: user.name,
			email: user.email,
			uid: expect.any(String),
		});
		expect(store.getState().auth.isAuth).toBe(true);
	});

	it('should be able to logout', async () => {
		await registerEmailPassword(user);

		const store = setupStore();

		await store.dispatch(loginWithEmailPassWord(user));
		await store.dispatch(logout);

		expect(store.getState().auth.user).toBeNull();
		expect(store.getState().auth.isAuth).toBe(false);
		expect(store.getState().entities.notes.list).toHaveLength(0);
	});
});
