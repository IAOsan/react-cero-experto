export function mapToList(map, transformItem) {
	return Object.keys(map).map((key) =>
		transformItem ? transformItem(map[key]) : map[key]
	);
}

export function listToMap(list) {
	return list.reduce((acc, o) => {
		acc[o.id] = o;
		return acc;
	}, {});
}
