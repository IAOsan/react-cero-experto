import 'vitest';
import '@testing-library/jest-dom';
import reducer, {
	initialState,
	load_started,
	load_finished,
	error_added,
	error_removed,
} from '../../store/slices/ui/ui.slice';

describe('UI reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should be able to start loading', () => {
		const result = reducer(undefined, load_started());

		expect(result.isLoading).toBe(true);
	});

	it('should be able to finish loading', () => {
		const result = reducer(undefined, load_finished());

		expect(result.isLoading).toBe(false);
	});

	it('should be able to add an error', () => {
		const error = { msg: 'some error' };
		const result = reducer(undefined, error_added(error));

		expect(result.error).toEqual(error);
	});

	it('should be able to remove an error', () => {
		const result = reducer(undefined, error_removed);

		expect(result.error).toBeNull();
	});
});
