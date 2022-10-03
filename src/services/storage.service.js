export function setItem(key, value) {
	try {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	} catch (error) {
		console.error('error setting item', error);
	}
}

export function getItem(key, defaultValue) {
	try {
		const data = JSON.parse(localStorage.getItem(key));
		return data || defaultValue;
	} catch (error) {
		console.error('error getting item', error);
		return defaultValue;
	}
}

export function clear() {
	localStorage.clear();
}
