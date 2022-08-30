const CLOUD_NAME = 'dflvdlaev';
export const BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
export const ENDPOINT = `${BASE_URL}/image/upload`;
export const PRESET = 'react-journal';

export async function uploadImage(file) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', PRESET);
	try {
		const opts = {
			method: 'POST',
			body: formData,
		};
		const res = await fetch(ENDPOINT, opts);
		if (!res.ok) {
			const error = new Error();
			error.status = res.status;
			error.message = (await res.json()) || res.statusText;
			throw error;
		}
		return await res.json();
	} catch (error) {
		if (error.status >= 400 && error.status < 500) throw error;
		console.error(error);
	}
}
