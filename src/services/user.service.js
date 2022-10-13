import httpService, { handleError } from './http.service';

const ENDPOINT = '/auth/register';

export async function register(user) {
	const { name, email, password } = user;

	try {
		const res = await httpService.post(ENDPOINT, {
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		});
		return res.data.user;
	} catch (error) {
		handleError(error);
	}
}

const service = {
	register,
};

export default service;
