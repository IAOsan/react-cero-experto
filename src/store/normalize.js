export function mapToList(map, transformItem) {
	return Object.keys(map).map((key) =>
		transformItem ? transformItem(map[key]) : map[key]
	);
}
