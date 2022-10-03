import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupStore } from '../store/storeConfig';

afterEach(cleanup);

export function setupUser() {
	return userEvent.setup();
}

export const customRender = (ui, options) =>
	render(ui, { wrapper: ({ children }) => children, ...options });

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
	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
