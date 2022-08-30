import { vi } from 'vitest';
import { clearAllAcounts } from '../test-utils';
import {
	handleError,
	registerEmailPassword,
	loginEmailPassword,
	logout,
} from '../../services/auth.service';

describe('handleError', () => {
	it('should throw an error if error code is client error', () => {
		const error = {
			code: 'auth/wrong-password',
		};
		expect(() => handleError(error)).toThrow();
	});
	it('should log an error if error code is not client error', () => {
		const error = {
			code: 'server/',
		};
		const logStub = vi.fn();
		vi.spyOn(window.console, 'error').mockImplementationOnce(logStub);

		handleError(error);

		expect(logStub).toHaveBeenCalled();
	});
});

const userCredentials = {
	name: 'user name',
	email: 'user@mail.com',
	password: '123456',
};
const expectedUserObject = {
	name: userCredentials.name,
	email: userCredentials.email,
	uid: expect.any(String),
};

describe('registerEmailPassword()', () => {
	beforeEach(clearAllAcounts);

	it('should create an user with email and password and return user object', async () => {
		const result = await registerEmailPassword(userCredentials);

		expect(result).toEqual(expectedUserObject);
	});

	it('should throw an error if user already exists', async () => {
		expect.assertions(1);

		try {
			await registerEmailPassword(userCredentials);
			await registerEmailPassword(userCredentials);
		} catch (error) {
			expect(error).toEqual({
				email: 'Email already in use',
			});
		}
	});
});

describe('loginEmailPassword()', () => {
	beforeEach(async () => {
		await clearAllAcounts();
		await registerEmailPassword(userCredentials);
	});

	it('should login with email and password', async () => {
		const result = await loginEmailPassword(userCredentials);

		expect(result).toEqual(expectedUserObject);
	});

	it('should throw an error if user not exists', async () => {
		const invalidUserCredentials = {
			...userCredentials,
			email: 'user_not_valid@mail.com',
		};

		expect.assertions(1);

		await expect(
			loginEmailPassword(invalidUserCredentials)
		).rejects.toEqual({
			email: 'User not found',
		});
	});

	it('should throw an error if user password is incorrect', async () => {
		const invalidUserCredentials = {
			...userCredentials,
			password: 'invalid password',
		};

		expect.assertions(1);

		await expect(
			loginEmailPassword(invalidUserCredentials)
		).rejects.toEqual({
			password: 'Wrong password',
		});
	});
});

describe('logout()', () => {
	it('should logout of user', async () => {
		expect.assertions(1);
		await expect(logout()).resolves;
	});
});
