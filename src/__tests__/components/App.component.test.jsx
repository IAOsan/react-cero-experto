import { vi } from 'vitest';
import { renderWithProviders, act, clearAllAcounts } from '../test-utils';
import App from '../../App';
import { login } from '../../store/slices/auth/auth.slice';
import { loadNotes } from '../../store/slices/notes/notes.slice';
import {
	registerEmailPassword,
	loginEmailPassword,
} from '../../services/auth.service';

vi.mock('../../store/slices/auth/auth.slice', async () => {
	const org = await vi.importActual('../../store/slices/auth/auth.slice');
	return {
		...org,
		login: vi.fn(() => vi.fn()),
	};
});

vi.mock('../../store/slices/notes/notes.slice', async () => {
	const org = await vi.importActual('../../store/slices/notes/notes.slice');
	return {
		...org,
		loadNotes: vi.fn(() => vi.fn()),
	};
});

const userCredentials = {
	name: 'user name',
	email: 'user@mail.com',
	password: '123456',
};
const expectedUserObj = {
	name: userCredentials.name,
	email: userCredentials.email,
	uid: expect.any(String),
};

describe('<App />', () => {
	beforeEach(async () => {
		await clearAllAcounts();
		// login
		await registerEmailPassword(userCredentials);
		await loginEmailPassword(userCredentials);
	});

	it('should check for user login', async () => {
		await act(async () => {
			renderApp();
		});
		expect(login).toHaveBeenCalledWith(expectedUserObj);
	});

	it('should load user notes if its authenticated', async () => {
		await act(async () => {
			renderApp();
		});
		expect(loadNotes).toHaveBeenCalledWith(expect.any(String));
	});
});

function renderApp() {
	return renderWithProviders(<App />);
}
