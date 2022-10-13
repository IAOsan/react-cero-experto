export async function makeApiCall(url, opts = {}) {
	try {
		const res = await fetch(url, opts);
		if (!res.ok) {
			const data = await res.json();
			const error = new Error();
			error.status = res.status;
			error.message = res.statusText;
			error.body = data.error;
			throw error;
		}
		if (!!res.headers.get('content-type')) return res.json();
		return res.text();
	} catch (error) {
		throw error;
	}
}

export function getClasName(...str) {
	return str
		.reduce((acc, s) => {
			if (!s) return acc;

			const isAnString = typeof s === 'string' && isNaN(s);
			const isANumber = typeof s === 'number' && !isNaN(s);
			const isAnObject = typeof s === 'object' && !!Object.keys(s).length;

			if (isAnString || isANumber) {
				acc.push(s);
			}

			if (isAnObject) {
				const [key, value] = Object.entries(s)[0];
				acc = acc.concat(!!value ? key : []);
			}

			return acc;
		}, [])
		.join(' ');
}

export function serialize(value) {
	return JSON.stringify(value);
}

export function deSerialize(value, reviver) {
	return JSON.parse(value, reviver);
}
