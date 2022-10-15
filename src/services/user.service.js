import httpService, { handleError } from './http.service';
import authService from './auth.service';

const ENDPOINT = '/auth/register';

export async function register(user) {
	try {
		const res = await httpService.post(ENDPOINT, {
			body: JSON.stringify(user),
		});
		const { token, id, name, email } = res.data.user;
		authService.loginWithToken(token);
		return { id, name, email };
	} catch (error) {
		handleError(error);
	}
}

const service = {
	register,
};

export default service;
