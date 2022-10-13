import jwtDecode from 'jwt-decode';
import httpService, { handleError } from './http.service';
import storageService from './storage.service';
import { TOKEN_KEY } from '../config';

const ENDPOINT = '/auth';

export async function login(user) {
	const { email, password } = user;
	try {
		const res = await httpService.post(ENDPOINT, {
			body: JSON.stringify({ email, password }),
		});
		storageService.setItem(TOKEN_KEY, res.data.user.token);
		return res;
	} catch (error) {
		handleError(error);
	}
}

export function loginWithToken(token) {
	storageService.setItem(TOKEN_KEY, token);
}

function logout() {
	storageService.clear();
}

async function renewToken() {
	try {
		const res = await httpService.get(`${ENDPOINT}/renew`);
		storageService.setItem(TOKEN_KEY, res.data.token);
		return res.data.token;
	} catch (error) {
		handleError(error);
	}
}

export async function getCurrentUser() {
	try {
		const token = await renewToken();
		const user = jwtDecode(token);
		return user;
	} catch (error) {
		return null;
	}
}

const service = {
	login,
	loginWithToken,
	getCurrentUser,
	logout,
};

export default service;
