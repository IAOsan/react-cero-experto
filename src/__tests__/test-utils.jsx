import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { setupStore } from '../store/store.config';

beforeEach(cleanup);

export function setupUser() {
	return userEvent.setup();
}

export async function clearDb() {
	await fetch(
		'http://localhost:8080/emulator/v1/projects/react-apps-1eb05/databases/(default)/documents',
		{
			method: 'DELETE',
		}
	);
}

export async function clearAllAcounts() {
	await fetch(
		'http://localhost:9099/emulator/v1/projects/react-apps-1eb05/accounts',
		{
			method: 'DELETE',
		}
	);
}

export function renderWithProviders(
	ui,
	{
		preloadedState = {},
		// Automatically create a store instance if no store was passed in
		store = setupStore(preloadedState),
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>;
	}

	// Return an object with the store and all of RTL's query functions
	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const customRender = (ui, options) =>
	render(ui, { wrapper: ({ children }) => children, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
