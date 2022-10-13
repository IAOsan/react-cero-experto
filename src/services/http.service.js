import { makeApiCall } from '../constants/utils';
import storageService from './storage.service';
import { API_BASE_URL, TOKEN_KEY } from '../config';

function generateUrl(path) {
	return new URL(`/api/v1${path}`, API_BASE_URL);
}

export function handleError(error) {
	if (error.status >= 400 && error.status < 500) {
		throw error.body;
	}
	console.error('oops: ', error);
}

function getToken() {
	return storageService.getItem(TOKEN_KEY, '');
}

const http = {
	get(path) {
		return makeApiCall(generateUrl(path), {
			method: 'GET',
			headers: {
				'x-token': getToken(),
			},
		});
	},
	post(path, opts) {
		return makeApiCall(generateUrl(path), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-token': getToken(),
			},
			...opts,
		});
	},
	put(path, opts) {
		return makeApiCall(generateUrl(path), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-token': getToken(),
			},
			...opts,
		});
	},
	delete(path, opts) {
		return makeApiCall(generateUrl(path), {
			method: 'DELETE',
			headers: {
				'x-token': getToken(),
			},
			...opts,
		});
	},
};

export default http;
